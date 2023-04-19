const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      name: { type: String, require: true },
      amount: { type: Number, require: true },
      image: { type: String, require: true },
      price: { type: Number, require: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      discount: { type: Number, require: true },
    },
  ],
  shippingAddress: [
    {
      fullName: { type: String, require: true },
      address: { type: String, require: true },
      city: { type: String, require: true },
      phone: { type: Number, require: true },
    },
  ],
  isPaid: { type: Boolean, require: true },
  isDelivered: { type: Boolean, require: true },
  paymentMethod: { type: String, require: true },
  itemsPrice: { type: Number, require: true },
  shippingPrice: { type: Number, require: true },
  taxPrice: { type: Number, require: true },
  totalPrice: { type: Number, require: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
});

module.exports = mongoose.model("Order", OrderSchema);
