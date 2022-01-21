const mongoose = require("mongoose");
const { Schema, Types, model } = mongoose;

exports.Order = model(
  "Order",
  new Schema(
    {
      costumer: String,
      cartItems: [],
    },
    { timestamps: true }
  )
);

exports.Promotion = model(
  "Promotion",
  new Schema({
    promotionCode: Number,
    percentageDiscount: Number,
    expireAt: Date,
  }).index({ expireAt: 1 }, { expireAfterSeconds: 0 })
);
