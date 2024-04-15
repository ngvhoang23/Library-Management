const bcrypt = require("bcrypt");
const db = require("../../config/db");
const moment = require("moment");

class ReaderController {
  // [GET] /users/readers
  getReaders(req, res) {}

  // [GET] /users/readers/:user_id
  getReaderById(req, res) {}

  // [GET] /users/readers/searching/:search_value
  searchReaders(req, res) {}

  // [POST] /users/reader
  postReader(req, res) {}

  // [DELETE] /users/reader
  deleteReader(req, res) {
    const { user_id } = req.body;

    const deleteAuthInfo = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `delete from user_auth_info where user_id = ${user_id}`,
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

    deleteAuthInfo()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }

  // [PUT] /users/reader
  editReader(req, res) {}

  // [PUT] /users/reader-status
  makeReaderActive(req, res) {}
}

module.exports = new ReaderController();
