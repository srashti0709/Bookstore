
const express = require("express");
const path = require("path");
const crypto = require("crypto");

const upload = require("../config/upload");
const supabase = require("../config/supabase");

const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all books
router.get("/", getBooks);

// Get a single book
router.get("/:id", getBookById);

// Upload PDF directly to private Supabase Storage
router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "PDF file is required",
        });
      }

      const extension = path.extname(req.file.originalname).toLowerCase();

      if (extension !== ".pdf") {
        return res.status(400).json({
          message: "Only PDF files are allowed",
        });
      }

      const filename = `${Date.now()}-${crypto.randomUUID()}.pdf`;

      const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET || "books")
        .upload(filename, req.file.buffer, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (error) {
        console.error("Supabase PDF upload error:", error.message);

        return res.status(500).json({
          message: "PDF upload failed",
        });
      }

      return res.status(200).json({
        message: "PDF uploaded successfully",
        contentUrl: `supabase://${filename}`,
      });
    } catch (error) {
      console.error("PDF upload error:", error);

      return res.status(500).json({
        message: "Could not upload PDF",
      });
    }
  }
);

// Create a book
router.post("/", protect, adminOnly, createBook);

// Update a book
router.put("/:id", protect, adminOnly, updateBook);

// Delete a book
router.delete("/:id", protect, adminOnly, deleteBook);

module.exports = router;