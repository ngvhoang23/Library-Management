const bcrypt = require("bcrypt");
const db = require("../../config/db");
const moment = require("moment");

class UserController {
  // [GET] /users/user-info
  getUserInfo(req, res) {
    const { user_id } = req.userInfo;
    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(`select * from user_info where user_id = ${user_id}`, (err, result) => {
          if (err) {
            reject(err);
          } else {
            if (result?.length > 0) {
              resolve(result[0]);
            } else {
              reject({ status: 400, message: "User not found" });
            }
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

  //[PUT] /users/password
  changePasswordUser(req, res) {
    const { old_password, new_password } = req.body;

    const { user_id } = req.userInfo;

    const comparePassword = () => {
      return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM user_auth_info WHERE user_name = '${user_name}'`, (err, result) => {
          if (err) {
            reject(err);
          } else {
            if (result.length > 0) {
              const user = result[0];
              bcrypt.compare(old_password, user.password).then((passwordCheck) => {
                if (!passwordCheck) {
                  return res.status(400).send({
                    message: "password_was_wrong",
                  });
                } else {
                  resolve(1);
                }
              });
            } else {
              reject({ status: 400, message: "USER NOT EXTST" });
            }
          }
        });
      });
    };

    const hashPassword = (password) => {
      return new Promise((resolve, reject) => {
        bcrypt
          .hash(password, 10)
          .then((hashed_password) => {
            resolve(hashed_password);
          })
          .catch((err) => {
            reject(err);
          });
      });
    };

    const updatePassword = (password) => {
      return new Promise((resolve, reject) => {
        hashPassword(password).then((hashed_password) => {
          db.query(
            `update user_auth_info set password='${hashed_password}' where user_id='${user_id}'`,
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            },
          );
        });
      });
    };

    comparePassword()
      .then(() => {
        return updatePassword(new_password);
      })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }

  //[PUT] /users/password-admin
  changePasswordByAdmin(req, res) {
    const { user_id, password } = req.body;

    const hashPassword = () => {
      return new Promise((resolve, reject) => {
        bcrypt
          .hash(password, 10)
          .then((hashed_password) => {
            resolve(hashed_password);
          })
          .catch((err) => {
            reject(err);
          });
      });
    };

    const updatePassword = () => {
      return new Promise((resolve, reject) => {
        hashPassword().then((hashed_password) => {
          db.query(
            `update user_auth_info set password='${hashed_password}' where user_id='${user_id}'`,
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            },
          );
        });
      });
    };

    updatePassword()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }
}

module.exports = new UserController();
