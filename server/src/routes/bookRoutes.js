const express = require("express");
const router = express.Router();
const fileUpload = require("../middlewares/multer");

const { getBooks, getBook, findBook, addBook, editBook, deleteBook } = require("../controllers/bookControllers");

router.get("/", getBooks);
router.post("/add-book", fileUpload.single("img"), addBook);
router.get("/:id", getBook);
router.post("/find", findBook);
router.get("/edit-book/:id", getBook);
router.patch("/edit-book/:id", fileUpload.single("img"), editBook);
router.delete("/edit-book/:id", deleteBook);

module.exports = router;
