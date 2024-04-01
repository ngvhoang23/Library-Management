var express = require("express");
var router = express.Router();

const { uploadCoverPhoto } = require("../uploadFile/uploadFile");

const BookController = require("../app/controllers/BookController");
const BorrowedBooksController = require("../app/controllers/BorrowedBooksController");
const { reader_auth, emp_auth, admin_auth } = require("../auth/auth");

router.get("/book-groups", BookController.getBookGroups);
router.get("/book-groups/:book_detail_id", BookController.getBookGroup);
router.get("/book-groups/searching/:search_value", BookController.searchBookGroups);
router.get("/searching/:search_value", BookController.searchBooks);
router.get("/categories", BookController.getCategories);
router.get("/authors", BookController.getAuthors);
router.get("/borrowed-books", BorrowedBooksController.getBorrowedBooks);
router.get("/:book_detail_id", BookController.getBooksByGroup);

router.post("/book-groups", uploadCoverPhoto.single("cover-photo"), BookController.postBookGroup);
router.post("/", BookController.postBook);

router.put("/book-groups", uploadCoverPhoto.single("cover-photo"), BookController.editBookGroup);
router.put("/", BookController.editBook);

module.exports = router;
