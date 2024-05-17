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

 
  // [DELETE] /users/employee
  deleteEmployee(req, res) {
    const { user_id } = req.body;

    const deleteAuthInfo = () => {
      return new Promise((resolve, reject) => {
        db.query(`delete from user_auth_info where user_id = ${user_id}`, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const deleteUserInfo = () => {
      return new Promise((resolve, reject) => {
        db.query(`delete from user_info where user_id = ${user_id}`, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    deleteUserInfo()
      .then((result) => {
        return deleteAuthInfo();
      })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }

  // [PUT] /users/employee
  editEmployee(req, res) {
    const { user_id, address, phone_num, birth_date, email_address, gender, first_name, last_name, created_at } =
      req.body;

    const user_avatar = `/user-avatars/${req?.file?.filename}`;

    const updateUserInfo = () => {
      const updateUserInfoSql = `
        update user_info set
        ${req?.file?.filename ? `user_avatar=${user_avatar ? `'${user_avatar}'` : null},` : ""} 
        phone_num=${phone_num ? `'${phone_num}'` : null}, 
        address=${address ? `'${address}'` : null}, 
        birth_date=${birth_date ? `'${birth_date}'` : null},
        email_address=${email_address ? `'${email_address}'` : null}, 
        gender=${gender ? `${gender}` : null}, 
        first_name=${first_name ? `'${first_name}'` : null}, 
        last_name=${last_name ? `'${last_name}'` : null},
        full_name='${first_name ? first_name : ""} ${last_name ? last_name : ""}',
        created_at=${created_at ? `'${created_at}'` : null}
        where user_id=${user_id}
      `;
      return new Promise((resolve, reject) => {
        db.query(updateUserInfoSql, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    updateUserInfo()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }
}

module.exports = new EmployeeController();
