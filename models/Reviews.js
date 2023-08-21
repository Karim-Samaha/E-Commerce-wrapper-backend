const mongoose = require("mongoose");

const reviewModel = mongoose.Schema({
  rate: {
    type: Number,
    max: [5, "Max is 5 Stars"],
    min: [1, "Min is 1 Star"],
    required: true,
  },
  review: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const Review = mongoose.model("Review", reviewModel);

module.exports = Review;
