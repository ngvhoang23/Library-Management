const db = require("../../config/db");
const bcrypt = require("bcrypt");
const moment = require("moment");

class EmployeeController {
  // [GET] /users/employees
  getEmployees(req, res) {
    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `
            select ui.*, uai.user_name, uai.password, uai.role, uai.role from user_auth_info uai
                inner join user_info ui
                on uai.user_id = ui.user_id
            where uai.role = 'emp'
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

  // [GET] /users/employees/:user_id
  getEmployeesById(req, res) {}

  // [GET] /users/employees/searching/:search_value
  searchEmployees(req, res) {
   const { search_value } = req.query;

      const promise = () => {
        return new Promise((resolve, reject) => {
          db.query(
            `
              select ui.*, uai.user_name, uai.password, uai.role, uai.role from user_auth_info uai
                  inner join user_info ui
                  on uai.user_id = ui.user_id
              where uai.role = 'emp' and ui.full_name like '%${search_value}%'
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

  // [POST] /users/employee
  postEmployee(req, res) {}

  // [DELETE] /users/employee
  deleteEmployee(req, res) {}

  // [PUT] /users/employee
  editEmployee(req, res) {}
}

module.exports = new EmployeeController();
