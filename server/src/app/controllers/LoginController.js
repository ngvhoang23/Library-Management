const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

class LoginController {
  // [GET] /login
  index(req, res) {
    res.send("Log In successfully");
  }

  // [POST] /login
  access(req, res) {
    const { user_name, password } = req.body;

    db.query(`SELECT * FROM user_auth_info WHERE user_name = '${user_name}'`, (err, result) => {
      if (err || result.length == 0) {
        res.status(404).send({
          message: "user_non_existent",
          err,
        });
        console.log(err || "user_name not found");
      } else {
        const user = result[0];
        bcrypt
          .compare(password, user.password)
          // if the passwords match
          .then((passwordCheck) => {
            // check if password matches
            if (!passwordCheck) {
              return res.status(400).send({
                message: "password_was_wrong",
              });
            }

            //   create JWT token

            const access_token = jwt.sign(
              {
                user_id: user.user_id,
                user_name: user.user_name,
                role: user.role,
              },
              process.env.ACCESS_TOKEN_SECRET_KEY,
              { expiresIn: process.env.ACCESS_TOKEN_DURATION },
            );

            db.query(`select * from user_info where user_id = ${user.user_id}`, (err, result) => {
              if (err) {
                return res.status(400).send({
                  message: "log in failed",
                  err,
                });
              } else {
                if (result.length === 0) {
                  return res.status(400).send({
                    message: "log in failed",
                  });
                }
                res.status(200).send({
                  message: "Login Successful",
                  access_token,
                  user_info: { ...result[0], role: user.role },
                });
              }
            });
          })
          .catch((error) => {
            res.status(400).send({
              message: "password_was_wronggg",
              error,
            });
          });
      }
    });
  }
}

module.exports = new LoginController();
