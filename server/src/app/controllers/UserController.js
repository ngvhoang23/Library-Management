const bcrypt = require("bcrypt");
const db = require("../../config/db");
const moment = require("moment");

class UserController {
  // [GET] /users/user-info
  getUserInfo(req, res) {}

  //[PUT] /users/password
  changePasswordUser(req, res) {}

  //[PUT] /users/password-admin
  changePasswordByAdmin(req, res) {}
}

module.exports = new UserController();
