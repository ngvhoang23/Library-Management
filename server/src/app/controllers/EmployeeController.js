const db = require("../../config/db");
const bcrypt = require("bcrypt");
const moment = require("moment");

class EmployeeController {
  // [GET] /users/employees
  getEmployees(req, res) {}

  // [GET] /users/employees/:user_id
  getEmployeesById(req, res) {}

  // [GET] /users/employees/searching/:search_value
  searchEmployees(req, res) {}

  // [POST] /users/employee
  postEmployee(req, res) {}

  // [DELETE] /users/employee
  deleteEmployee(req, res) {}

  // [PUT] /users/employee
  editEmployee(req, res) {}
}

module.exports = new EmployeeController();
