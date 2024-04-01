const bcrypt = require("bcrypt");
const db = require("../../config/db");
const moment = require("moment");

class BookController {
  // [GET] /books
  getBooks(req, res) {}

  // [GET] /books/:book_detail_id
  getBooksByGroup(req, res) {}

  // [GET] /books/categories
  getCategories(req, res) {}

  // [GET] /books/book-groups/
  getBookGroups(req, res) {}

  // [GET] /books/book-groups/:book_detail_id
  getBookGroup(req, res) {}

  // [GET] /books/books-groups/searching/:search_value
  searchBookGroups(req, res) {}

  // [GET] /books/searching/:search_value
  searchBooks(req, res) {}

  // [GET] /books/authors
  getAuthors(req, res) {}

  // [GET] /books/by-author
  getBookByAuthor(req, res) {}

  // [GET] /books/by-category
  getBookByCategory(req, res) {}

  // [POST] /books/book-groups
  postBookGroup(req, res) {}

  // [POST] /books
  postBook(req, res) {}

  // [DELETE] /books
  deleteBook(req, res) {}

  // [PUT] /books/book-groups
  editBookGroup(req, res) {}

  // [PUT] /books/
  editBook(req, res) {}
}

module.exports = new BookController();
