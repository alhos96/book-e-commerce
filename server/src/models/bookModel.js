const mongoose = require("mongoose");
const { Schema, Types, model } = mongoose;

exports.Book = model(
  "Book",
  new Schema({
    title: String,
    titleForSearch: String, //lowercased book title
    author: String,
    image: String,
    price: Number,
    stock: Number,
    stopOrder: { type: Boolean, default: false },
    reorderNotification: Number,
  })
);
