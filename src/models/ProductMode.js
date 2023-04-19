const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    image: { type: String, require: true },
    type: { type: String, require: true },
    price: { type: String, require: true },
    countInStock: { type: String, require: true },
    rating: { type: String, require: true },
    discount: { type: Number, require: true },
    sold: { type: Number, require: true },
    description: { type: String, require: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  },
  {
    timeStamp: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
