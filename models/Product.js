const mongoose = require("mongoose");
const ProductsSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: [true, "Must Provide name"],
    trim: true,
    maxLength: [50, "Name must be less than 50 characters"],
  },
  description: {
    type: "string",
    required: [true, "Must Provide description"],
    trim: true,
    maxLength: [100, "Description must be less than 100 characters"],
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: "string",
    required: false,
    trim: true,
  },
  category: {
    type: "string",
    required: [true, "Must Provide category"],
    trim: true,
    maxLength: [50, "Category must be less than 50 characters"],
  },
});
module.exports = mongoose.model("Products", ProductsSchema);
