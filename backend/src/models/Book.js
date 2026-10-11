const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    contentUrl: {
      type: String,
      default: "",
    },

    accessType: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    price: {
      type: Number,
      required: function () {
        return this.accessType === "premium";
      },
      min: 0,
      default: 0,
    },

   
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);