const mongoose = require("mongoose");
const { Schema, model } = mongoose;

exports.User = model(
  "User",
  new Schema({
    username: String,
    password: String,
    email: String,
    address: String,
    city: String,
    zipcode: Number,
    member: { type: Boolean, default: false },
    role: { type: String, default: "user" },
  })
);
