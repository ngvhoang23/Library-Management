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
