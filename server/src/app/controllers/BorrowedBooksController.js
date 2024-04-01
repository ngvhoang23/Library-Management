const bcrypt = require("bcrypt");
const db = require("../../config/db");
const moment = require("moment");

class BorrowedBooksController {
  // [GET] /borrowed-books
  getBorrowedBooks(req, res) {}

  // [POST] /borrowed-books
  postBorrowedBooks(req, res) {}

  // [PUT] /borrowed-books/return-book
  returnBook(req, res) {}
}

module.exports = new BorrowedBooksController();
