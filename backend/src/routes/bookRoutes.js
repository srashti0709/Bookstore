const express = require("express");
const upload = require("../config/upload");
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getBooks);
router.get("/:id", getBookById);

// Admin only
router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("pdf"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required",
      });
    }

    res.status(200).json({
      message: "PDF uploaded successfully",
      contentUrl: `/uploads/books/${req.file.filename}`,
    });
  }
);
router.post("/", protect, adminOnly, createBook);
router.put("/:id", protect, adminOnly, updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

module.exports = router;