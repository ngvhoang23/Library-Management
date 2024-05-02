const bcrypt = require("bcrypt");
const db = require("../../config/db");
const moment = require("moment");

class BookController {
  // [GET] /books
  getBooks(req, res) {
    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `
          select * from books 
          inner join book_detail on books.book_detail_id = book_detail.book_detail_id
          inner join authors on book_detail.author_id = authors.author_id
          inner join categories on book_detail.category_id = categories.category_id
        `,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
    };

    promise()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }

  // [GET] /books/:book_detail_id
  getBooksByGroup(req, res) {
    const { book_detail_id } = req.query;

    const promise = () => {
      const sql = `
      select * from books 
        inner join book_detail on books.book_detail_id = book_detail.book_detail_id
        inner join authors on book_detail.author_id = authors.author_id
        inner join categories on book_detail.category_id = categories.category_id
      where books.book_detail_id = ${book_detail_id}
      `;

      return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    promise()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }

  // [GET] /books/categories
  getCategories(req, res) {
    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `
        select * from categories
        `,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
        );
      });
    };

    promise()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }

  // [GET] /books/book-groups/
  getBookGroups(req, res) {
    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `
        select * from book_detail
          inner join authors on book_detail.author_id = authors.author_id
          inner join categories on book_detail.category_id = categories.category_id
        `,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
    };

    promise()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }

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
