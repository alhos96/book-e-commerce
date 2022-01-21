require("dotenv").config();
const { Book } = require("../models/bookModel");
const mongoose = require("mongoose");
const books = require("./data/Books.json");
const config = require("../../config");

mongoose.connect(config.mongo).then(() => {
  mongoose.connection.collections["books"].drop(function (err) {
    console.log("books collection dropped");
  });

  seed();
});

var done = 0;

function seed() {
  books.forEach(async (book, i) => {
    let newBook = new Book({
      title: book.title,
      titleForSearch: book.title.toLowerCase(),
      image: book.image,
      author: book.author,
      pages: book.pages,
      price: book.price,
      stock: book.stock,
      reorderNotification: book.reorderNotification,
    });

    try {
      await newBook.save();
      done++;
    } catch (error) {
      console.log(error);
    }

    if (done === books.length) {
      console.log("seeding books done");
      mongoose.disconnect();
    }
  });
}
