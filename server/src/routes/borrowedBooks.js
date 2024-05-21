var express = require("express");
var router = express.Router();

const { uploadCoverPhoto } = require("../uploadFile/uploadFile");

const BorrowedBooksController = require("../app/controllers/BorrowedBooksController");
const { reader_auth, emp_auth, admin_auth } = require("../auth/auth");

router.get("/", emp_auth, BorrowedBooksController.getBorrowedBooks);
router.get("/statistic/books-borrowed", emp_auth, BorrowedBooksController.getBooksBorrowedStatisticByCategory);
router.get("/statistic/overdue-books", emp_auth, BorrowedBooksController.getOverdueBooksStatistic);
router.get("/statistic/book-status", emp_auth, BorrowedBooksController.getBookStatusStatistic);
router.get("/popular-books", reader_auth, BorrowedBooksController.getPopularBooks);
router.get("/checking-borrowing-conditions", BorrowedBooksController.checkValidReaderToBorrow);

router.get("/fine", emp_auth, BorrowedBooksController.getFine);
router.get("/fine/:reader_id", reader_auth, BorrowedBooksController.getFineByReader);
router.get("/fine/searching/:search_value", emp_auth, BorrowedBooksController.searchFine);

router.get("/borrowers", emp_auth, BorrowedBooksController.getBorrowers);
router.get("/borrowers/searching/:search_value", emp_auth, BorrowedBooksController.searchBorrowers);

router.get("/borrowing-readers", emp_auth, BorrowedBooksController.getBorrowingReaders);
router.get("/borrowing-readers/searching/:search_value", BorrowedBooksController.searchBorrowingReaders);

router.get("/borrowing-books/", emp_auth, BorrowedBooksController.getBorrowingBooks);
router.get("/borrowing-books/detail/:borrow_id", reader_auth, BorrowedBooksController.getBorrowingBookDetail);
router.get("/borrowing-books/searching/:search_value", reader_auth, BorrowedBooksController.searchBorrowingBooks);
router.get(
  "/borrowing-books/searching-by-borrower/:search_value",
  BorrowedBooksController.searchBorrowingBooksByBorrower,
);
router.get("/borrowing-books/:borrower_id", reader_auth, BorrowedBooksController.getBorrowingBooksByBorrower);

router.get("/book-groups", emp_auth, BorrowedBooksController.getBookGroups);
router.get("/book-groups/searching/:search_value", emp_auth, BorrowedBooksController.searchBookGroups);

router.get("/available-books/:book_detail_id", emp_auth, BorrowedBooksController.getAvailableBooksByGroup);
router.get("/available-books/searching/:search_value", emp_auth, BorrowedBooksController.searchAvailableBooksByGroup);

router.post("/", emp_auth, BorrowedBooksController.postBorrowedBooks);
router.post("/fine/", emp_auth, BorrowedBooksController.payFine);

router.put("/return-book/:borrow_id", emp_auth, BorrowedBooksController.returnBook);
router.put("/extend-book/:borrow_id", emp_auth, BorrowedBooksController.extendBook);

router.delete("/:borrow_id", emp_auth, BorrowedBooksController.deleteBorrowedBook);

module.exports = router;
