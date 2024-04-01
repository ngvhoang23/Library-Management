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
  deleteReader(req, res) {}

  // [PUT] /users/reader
  editReader(req, res) {}

  // [PUT] /users/reader-status
  makeReaderActive(req, res) {}
}

module.exports = new ReaderController();
