const bcrypt = require("bcrypt");
const db = require("../../config/db");
const moment = require("moment");

class BorrowedBooksController {
  // [GET] /borrowed-books
  getBorrowedBooks(req, res) {}

   // [POST] /borrowed-books
   postBorrowedBooks(req, res) {
    const { emp_id, reader_id, book_id, borrow_date, return_date } = req.body;

    const data = [];

    data.push([
      emp_id || null,
      reader_id || null,
      book_id || null,
      borrow_date || null,
      return_date || null,
      moment().format(),
    ]);

    const checkingBookStatus = () => {
      return new Promise((resolve, reject) => {
        db.query(`select * from books where book_id=${book_id} and status=1`, (err, result) => {
          if (err) {
            reject(err);
          } else {
            if (result.length === 0) {
              reject({ message: "This book is unavailable", code: "UNAVAILABLE_BOOK", status: 400 });
            } else {
              resolve(result);
            }
          }
        });
      });
    };

    const updateBookStatus = () => {
      return new Promise((resolve, reject) => {
        db.query(`update books set status=0 where book_id=${book_id}`, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `insert into borrowed_books(emp_id, reader_id, book_id, borrow_date, return_date, created_at) values ?`,
          [data],
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

    checkValidReaderToBorrow(reader_id)
      .then((result) => {
        return checkingBookStatus();
      })
      .then((result) => {
        return updateBookStatus();
      })
      .then((result) => {
        return promise();
      })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }


   // [PUT] /borrowed-books/return-book/:borrow_id
   returnBook(req, res) {
    const { borrow_id, actual_return_date } = req.body;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `update borrowed_books set actual_return_date='${actual_return_date}' where borrow_id=${borrow_id}`,
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
        console.log(err);
        res.status(400).send(err);
      });
  }

  getOverdueBooksStatistic(req, res) {
    const { date } = req.query;

    const promise = () => {
      return new Promise((resolve, reject) => {
        const sql = `
        select bb.*, bd.book_name, DATEDIFF(DATE('${date}'), bb.return_date) as overdue_days from borrowed_books bb
        inner join books b
        on b.book_id = bb.book_id
        inner join book_detail bd
        on bd.book_detail_id = b.book_detail_id
        where bb.return_date < DATE('${date}') and bb.actual_return_date is null;
        with rm as (
          select bd.book_detail_id, count(*) as count from borrowed_books bb
          inner join books b
          on b.book_id = bb.book_id
          inner join book_detail bd
          on bd.book_detail_id = b.book_detail_id
          where bb.return_date < DATE('${date}') and bb.actual_return_date is null
          group by bd.book_detail_id
        )
        select * from rm
        inner join book_detail bd 
        on rm.book_detail_id = bd.book_detail_id
          `;

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
        console.log(result);
        const data = {
          overdue_data: result[0],
          overdue_book_detail: result[1],
        };
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }
}

module.exports = new BorrowedBooksController();
