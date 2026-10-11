const express = require("express");
const cors = require("cors");

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

    if (!book.contentUrl?.startsWith("/uploads/books/")) {
      return res.status(404).json({ message: "Book file not found" });
    }

    // Free books remain available without login.
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