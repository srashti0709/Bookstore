const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");

const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const Book = require("./models/Book");
const Purchase = require("./models/Purchase");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const app = express();


app.use(cors());

app.use(express.json());

// Serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);


app.get("/", (req, res) => {
  res.json({ message: "Bookstore API is running" });
});


app.get("/api/books/:id/read", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Verify purchase before serving a premium book
    if (book.accessType === "premium") {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "Log in and purchase this book to read it",
        });
      }

      let user;

      try {
        user = jwt.verify(
          authHeader.split(" ")[1],
          process.env.JWT_SECRET
        );
      } catch {
        return res.status(401).json({
          message: "Please log in again",
        });
      }

      const purchase = await Purchase.findOne({
        user: user.id,
        book: book._id,
      });

      if (!purchase) {
        return res.status(403).json({
          message: "Purchase this book to read it",
        });
      }
    }

    // Read PDFs stored in Supabase
    if (book.contentUrl?.startsWith("supabase://")) {
      const filename = path.basename(
        book.contentUrl.slice("supabase://".length)
      );

      if (!filename || filename === "." || filename === "..") {
        return res.status(404).json({
          message: "Book file not found",
        });
      }

      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET || "books")
        .createSignedUrl(filename, 60);

      if (error || !data?.signedUrl) {
        console.error("Supabase signed URL error:", error?.message);

        return res.status(404).json({
          message: "Book file not found in storage",
        });
      }

      const pdfResponse = await fetch(data.signedUrl);

      if (!pdfResponse.ok) {
        console.error("PDF download failed:", pdfResponse.status);

        return res.status(502).json({
          message: "Could not retrieve book PDF",
        });
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${filename}"`
      );

      const pdfBuffer = Buffer.from(
        await pdfResponse.arrayBuffer()
      );

      return res.send(pdfBuffer);
    }

    // Keep support for older PDFs stored locally
    if (book.contentUrl?.startsWith("/uploads/books/")) {
      const filename = path.basename(book.contentUrl);
      const filePath = path.join(
        __dirname,
        "../uploads/books",
        filename
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          message: "Book file not found",
        });
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${filename}"`
      );

      return res.sendFile(filePath);
    }

    return res.status(404).json({
      message: "Book file not found",
    });
  } catch (error) {
    console.error("Book reading error:", error);

    return res.status(500).json({
      message: "Could not open book",
    });
  }
});

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

module.exports = app;