const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name Is Required"],
      unique: true,
    },
    image: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
categorySchema.virtual("products", {
  ref: "Product",
  foreignField: "category",
  localField: "_id",
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
