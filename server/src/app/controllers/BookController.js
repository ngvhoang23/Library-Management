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
  getBookGroup(req, res) {
    const { user_id, role } = req.userInfo;

    const { book_detail_id } = req.query;

    console.log(role);

    let sql = "";

    if (role == "emp" || role == "admin") {
      sql = `
      select * from book_detail
        inner join authors on book_detail.author_id = authors.author_id
        inner join categories on book_detail.category_id = categories.category_id
        where book_detail_id=${book_detail_id}
      `;
    }

    if (role === "reader") {
      sql = `
      select *, getAvailableBookQuantity(book_detail.book_detail_id) as available, getTotalOfBookDetail(book_detail.book_detail_id) as total_book, getReadsOfBookDetail(book_detail.book_detail_id) as _reads from book_detail
        inner join authors on book_detail.author_id = authors.author_id
        inner join categories on book_detail.category_id = categories.category_id
        where book_detail.book_detail_id=${book_detail_id}
      `;
    }

    const promise = () => {
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
        console.log(err);
        res.status(400).send(err);
      });
  }

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

  // [DELETE] /books/:book_id
  deleteBooks(req, res) {
    const { deleting_books } = req.body;

    const getBookIdList = () => {
      return deleting_books
        .map((book_id) => {
          return book_id;
        })
        .join(",");
    };

    const promise = () => {
      const sql = `delete from books where book_id in (${getBookIdList()})`;
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
        console.log(err);
        res.status(400).send(err);
      });
  }

  // [PUT] /books/book-groups
  editBookGroup(req, res) {
    const { book_detail_id, book_name, price, published_date, author_id, description, category_id, publish_com } =
      req.body;

    let cover_photo = null;

    if (req?.file?.filename) {
      cover_photo = `/book-cover-photos/${req?.file.filename}`;
    }

    let updatedBook = [
      book_name || null,
      price || null,
      published_date || null,
      author_id || null,
      description || null,
      category_id || null,
      publish_com || null,
      book_detail_id,
    ];

    if (cover_photo) {
      updatedBook = [
        book_name || null,
        price || null,
        published_date || null,
        author_id || null,
        description || null,
        category_id || null,
        publish_com || null,
        cover_photo,
        book_detail_id,
      ];
    }

    const updateBook = () => {
      let updateUserInfoSql = `
            update book_detail set 
            book_name=?,
            price=?, 
            published_date=?, 
            author_id=?, 
            description=?,
            category_id=?, 
            publish_com=?
            where book_detail_id=?
          `;
      if (cover_photo) {
        updateUserInfoSql = `
            update book_detail set 
            book_name=?,
            price=?, 
            published_date=?, 
            author_id=?, 
            description=?,
            category_id=?, 
            publish_com=?,
            cover_photo=?
            where book_detail_id=?
          `;
      }
      return new Promise((resolve, reject) => {
        db.query(updateUserInfoSql, updatedBook, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    updateBook()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }

  // [PUT] /books/
  editBook(req, res) {}
}

module.exports = new BookController();
