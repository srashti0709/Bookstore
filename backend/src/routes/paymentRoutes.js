
const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const Book = require("../models/Book");
const Purchase = require("../models/Purchase");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order for the logged-in user and a specific premium book
router.post("/order", protect, async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.accessType !== "premium" || book.price <= 0) {
      return res.status(400).json({
        message: "This book is not available for premium purchase",
      });
    }

    const existingPurchase = await Purchase.findOne({
      user: req.user.id,
      book: book._id,
    });

    if (existingPurchase) {
      return res.status(400).json({
        message: "You already own this book",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(book.price * 100),
      currency: "INR",
      receipt: `book_${Date.now()}`,
      notes: {
        bookId: book._id.toString(),
        userId: req.user.id,
      },
    });

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      bookTitle: book.title,
    });
  } catch (error) {
    console.error("Payment order error:", error);
    res.status(500).json({
      message: "Could not create payment order",
    });
  }
});

// Verify payment and save ownership of the purchased book
router.post("/verify", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expected = Buffer.from(expectedSignature, "hex");
    const received = Buffer.from(razorpay_signature, "hex");

    if (
      expected.length !== received.length ||
      !crypto.timingSafeEqual(expected, received)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Fetch order and payment directly from Razorpay.
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Make sure this order belongs to this user.
    if (order.notes?.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "This payment order does not belong to your account",
      });
    }

    if (
      payment.order_id !== order.id ||
      payment.status !== "captured" ||
      payment.amount !== order.amount ||
      payment.currency !== order.currency ||
      order.status !== "paid"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment has not been successfully captured",
      });
    }

    const book = await Book.findById(order.notes?.bookId);

    if (
      !book ||
      book.accessType !== "premium" ||
      order.amount !== Math.round(book.price * 100) ||
      order.currency !== "INR"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment does not match this book",
      });
    }

    // Do not create duplicate ownership records.
    const existingPurchase = await Purchase.findOne({
      user: req.user.id,
      book: book._id,
    });

    if (existingPurchase) {
      return res.status(200).json({
        success: true,
        message: "You already own this book",
        bookId: book._id,
      });
    }

    await Purchase.create({
      user: req.user.id,
      book: book._id,
      paymentId: razorpay_payment_id,
      amount: payment.amount,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and book unlocked",
      bookId: book._id,
    });
  } catch (error) {
    // A duplicate payment callback may arrive more than once.
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "Purchase already recorded",
      });
    }

    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Could not verify payment",
    });
  }
});

router.get("/access/:bookId", protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Free books are available to everyone.
    if (book.accessType === "free") {
      return res.json({ hasAccess: true });
    }

    // Premium books require a purchase by this user.
    const purchase = await Purchase.findOne({
      user: req.user.id,
      book: book._id,
    });

    return res.json({ hasAccess: Boolean(purchase) });
  } catch (error) {
    console.error("Book access check failed:", error);
    return res.status(500).json({
      message: "Could not check book access",
    });
  }
});

router.get("/library", protect, async (req, res) => {
  try {
    const purchases = await Purchase.find({
      user: req.user.id,
    }).populate("book");

    const books = purchases
      .filter((purchase) => purchase.book)
      .map((purchase) => purchase.book);

    res.status(200).json({ books });
  } catch (error) {
    console.error("Failed to load library:", error);
    res.status(500).json({
      message: "Could not load your library",
    });
  }
});
module.exports = router;