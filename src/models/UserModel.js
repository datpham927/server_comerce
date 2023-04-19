const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean, require: true, default: false },
    phone: { type: Number, require: true },
    address: { type: String, require: true },
    avatar: { type: String, require: true },
    access_token: { type: String, require: true },
  },
  {
    timeStamp: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
