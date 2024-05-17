const bcrypt = require("bcrypt");
const db = require("../../config/db");
const moment = require("moment");

class ReaderController {
  // [GET] /users/readers
  getReaders(req, res) {
    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `
            select ui.*, uai.user_name, uai.password, uai.role, uai.role from user_auth_info uai
                inner join user_info ui
                on uai.user_id = ui.user_id
            where uai.role = 'reader'
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

  // [GET] /users/readers/:user_id
  getReaderById(req, res) {
    const { user_id } = req.query;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `
            select ui.*, uai.user_name, uai.password, uai.role, uai.role from user_auth_info uai
                inner join user_info ui
                on uai.user_id = ui.user_id
            where uai.role = 'reader' and uai.user_id=${user_id}
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

  // [GET] /users/readers/searching/:search_value
  searchReaders(req, res) {
  const { search_value } = req.query;

      const promise = () => {
        const data = [`%${search_value}%`];
        const sql = `
          select ui.*, uai.user_name, uai.password, uai.role, uai.role from user_auth_info uai
          inner join user_info ui
          on uai.user_id = ui.user_id
          where uai.role = 'reader' and ui.full_name like ?
        `;
        return new Promise((resolve, reject) => {
          db.query(sql, data, (err, result) => {
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

   // [POST] /users/reader
   postReader(req, res) {
    const {
      user_name,
      password,
      address,
      phone_num,
      birth_date,
      gender,
      first_name,
      last_name,
      reader_type,
      created_at,
      expired_date,
    } = req.body;

    let user_avatar = `/user-avatars/${req?.file?.filename}`;

    if (req?.file) {
      user_avatar = `/user-avatars/${req?.file.filename}`;
    } else {
      user_avatar = `/user-avatars/default_avatar.png`;
    }

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

    const insertUserAuthInfo = (hashed_password) => {
      return new Promise((resolve, reject) => {
        db.query(
          `insert into user_auth_info(user_name, password, role) values('${user_name}', '${hashed_password}', 'reader')`,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.insertId);
            }
          },
        );
      });
    };

    const insertUserInfo = (user_id) => {
      return new Promise((resolve, reject) => {
        db.query(
          `insert into user_info(user_id, user_avatar, phone_num, address, birth_date, email_address, gender, first_name, last_name, full_name, created_at, reader_type, expire_date) 
            values(
            ${user_id}, 
            ${user_avatar ? `'${user_avatar}'` : null}, 
            ${phone_num ? `'${phone_num}'` : null},
            ${address ? `'${address}'` : null}, 
            ${birth_date ? `'${birth_date}'` : null}, 
            ${user_name ? `'${user_name}'` : null}, 
            ${gender}, 
            ${first_name ? `'${first_name}'` : null}, 
            ${last_name ? `'${last_name}'` : null}, 
            '${first_name} ${last_name}', 
            ${created_at ? `'${created_at}'` : null},             
            ${reader_type ? `'${reader_type}'` : null},
            ${expired_date ? `'${expired_date}'` : null}        
            )`,
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

    hashPassword()
      .then((hashed_password) => {
        return insertUserAuthInfo(hashed_password);
      })
      .then((user_id) => {
        return insertUserInfo(user_id);
      })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }


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
  editReader(req, res) {
    const {
      user_id,
      address,
      phone_num,
      birth_date,
      email_address,
      gender,
      first_name,
      last_name,
      created_at,
    } = req.body;

    const user_avatar = `/user-avatars/${req?.file?.filename}`;

    const updateUserInfo = () => {
      const updateUserInfoSql = `
            update user_info set 
            ${
              req?.file?.filename
                ? `user_avatar=${user_avatar ? `'${user_avatar}'` : null},`
                : ""
            } 
            phone_num=${phone_num ? `'${phone_num}'` : null}, 
            address=${address ? `'${address}'` : null}, 
            birth_date=${birth_date ? `'${birth_date}'` : null},
            email_address=${email_address ? `'${email_address}'` : null}, 
            gender=${gender ? `'${gender}'` : null}, 
            first_name=${first_name ? `'${first_name}'` : null}, 
            last_name=${last_name ? `'${last_name}'` : null},
            full_name='${first_name ? first_name : ""} ${
        last_name ? last_name : ""
      }',
            created_at=${created_at ? `'${created_at}'` : "created_at"}
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

  makeReaderActive(req, res) {
    const { user_id, month } = req.body;

    const promise = () => {
      return new Promise((resolve, reject) => {
        db.query(
          `update user_info set expire_date = DATE_ADD(curdate(), INTERVAL ${month} MONTH) where user_id=${user_id}`,
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
}

module.exports = new ReaderController();
