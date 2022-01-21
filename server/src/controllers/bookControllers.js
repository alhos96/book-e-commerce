const { Book } = require("../models/bookModel");

exports.getBooks = async (req, res, next) => {
  let books = await Book.find();

  let sortedBooks = books.sort((a, b) => a.title.toLowerCase() - b.title.toLowerCase());

  res.status(200).json(sortedBooks);
};

exports.findBook = async (req, res, next) => {
  let { search } = req.body;

  //let book = await Book.find({ titleForSearch: search.toLowerCase() });
  let allBooks = await Book.find();

  let searchedBooks = [];

  allBooks.map((book) => {
    if (book.titleForSearch.includes(search)) {
      searchedBooks.push(book);
    }
  });

  if (searchedBooks) {
    res.status(200).json(searchedBooks);
  } else {
    const error = new Error("No books found..");
    console.log(error);
    res.status(400).json([]);
    return next(error);
  }
};

exports.getBook = async (req, res, next) => {
  let { id } = req.params;

  let book = await Book.findById(id);

  if (book) {
    res.status(200).json(book);
  } else {
    const error = new Error("Something went wrong");
    return next(error);
  }
};

exports.addBook = async (req, res, next) => {
  const { title, author, price, pages, stock, reorderNotification } = req.body;
  const image = req.file.filename;

  const newBook = new Book({
    title,
    titleForSearch: title.toLowerCase().trim(),
    author,
    price,
    pages,
    image,
    stock,
    reorderNotification,
  });

  await newBook.save();

  res.json(newBook);
};

exports.editBook = async (req, res, next) => {
  const bookId = req.params.id;
  const { title, author, price, stock, reorderNotification, img } = req.body;

  await Book.findByIdAndUpdate(bookId, {
    title,
    titleForSearch: title.toLowerCase().trim(),
    price,
    author,
    stock,
    reorderNotification,
    stopOrder: +stock === 0 ? true : false,
    image: req.file ? req.file.filename : img,
  });

  res.json({ message: "Success!" });
};

exports.deleteBook = async (req, res, next) => {
  const { id } = req.params;

  await Book.findByIdAndDelete(id);

  let books = await Book.find();

  res.json({ data: books });
};
