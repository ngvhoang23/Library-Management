var express = require("express");
var router = express.Router();

const { uploadCoverPhoto } = require("../uploadFile/uploadFile");

const BookController = require("../app/controllers/BookController");
const BorrowedBooksController = require("../app/controllers/BorrowedBooksController");
const { reader_auth, emp_auth, admin_auth } = require("../auth/auth");

// reader role

router.get("/book-groups-by-reader", reader_auth, BookController.getBookGroupsByReader);
router.get("/books-by-reader/:book_detail_id", reader_auth, BookController.getBookGroupsByReader);
router.get("/available-books/:book_detail_id", reader_auth, BookController.getAvailableBooksByBookGroup);
router.get("/", emp_auth, BookController.getBooks);
router.get("/by-category", reader_auth, BookController.getBookByCategory);
router.get("/by-author", reader_auth, BookController.getBookByAuthor);
router.get("/book-groups", reader_auth, BookController.getBookGroups);
router.get("/book-groups/:book_detail_id", reader_auth, BookController.getBookGroup);
router.get("/book-groups/searching/:search_value", reader_auth, BookController.searchBookGroups);
router.get(
  "/book-groups/searching-for-category/:search_value",
  reader_auth,
  BookController.searchBookGroupsForCategory,
);
router.get("/searching/:search_value", emp_auth, BookController.searchBooks);
router.get("/categories", reader_auth, BookController.getCategories);
router.get("/authors", reader_auth, BookController.getAuthors);
router.get("/borrowed-books", emp_auth, BorrowedBooksController.getBorrowedBooks);
router.get("/:book_detail_id", emp_auth, BookController.getBooksByGroup);

router.post("/book-groups", uploadCoverPhoto.single("cover-photo"), emp_auth, BookController.postBookGroup);
router.post("/", emp_auth, BookController.postBook);

router.put("/book-groups", uploadCoverPhoto.single("cover-photo"), emp_auth, BookController.editBookGroup);
router.put("/", emp_auth, BookController.editBook);

router.delete("/", emp_auth, BookController.deleteBooks);
router.delete("/book-groups/:book_detail_id", emp_auth, BookController.deleteBookGroup);

module.exports = router;
