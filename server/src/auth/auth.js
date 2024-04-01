const jwt = require("jsonwebtoken");
const db = require("../config/db");

const checkingAdmin = async (user_id) => {
  return new Promise((resolve, reject) => {
    db.query(`select * from user_auth_info where user_id = ${user_id} and role = 'admin'`, (err, result) => {
      if (err) {
        reject({ status: 400, messages: "User does not exist" });
      } else {
        if (result.length === 0) {
          reject({ status: 400, messages: "User does not have admin permision" });
        } else {
          resolve(result[0]);
        }
      }
    });
  });
};

const checkingEmp = async (user_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `select * from user_auth_info where user_id = ${user_id} and (role = 'emp' or role = 'admin')`,
      (err, result) => {
        if (err) {
          reject({ status: 400, messages: "User does not exist" });
        } else {
          if (result.length === 0) {
            reject({ status: 400, messages: "User does not have employee permision" });
          } else {
            resolve(result[0]);
          }
        }
      },
    );
  });
};

const checkingReader = async (user_id) => {
  return new Promise((resolve, reject) => {
    db.query(`select * from user_auth_info where user_id = ${user_id}`, (err, result) => {
      if (err) {
        reject({ status: 400, messages: "User does not exist" });
      } else {
        if (result.length === 0) {
          reject({ status: 400, messages: "User does not have reader permision" });
        } else {
          resolve(result[0]);
        }
      }
    });
  });
};

const admin_auth = async (req, res, next) => {
  try {
    //   get the token from the authorization header
    const access_token = await req.headers.authorization.split(" ")[1];
    //check if the token matches the supposed origin
    const decodedToken = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET_KEY);

    // retrieve the user details of the logged in user
    const user = await decodedToken;

    checkingAdmin(user.user_id)
      .then((result) => {
        req.userInfo = result;
        next();
      })
      .catch((err) => {
        res.status(401).json({
          error: err,
        });
      });
  } catch (error) {
    console.log("error: ", error);
    res.status(401).json({
      error: error,
    });
  }
};

const emp_auth = async (req, res, next) => {
  try {
    //   get the token from the authorization header
    const access_token = await req.headers.authorization.split(" ")[1];
    //check if the token matches the supposed origin
    const decodedToken = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET_KEY);

    // retrieve the user details of the logged in user
    const user = await decodedToken;

    checkingEmp(user.user_id)
      .then((result) => {
        req.userInfo = result;
        next();
      })
      .catch((err) => {
        res.status(401).json({
          error: err,
        });
      });
  } catch (error) {
    console.log("error: ", error);
    res.status(401).json({
      error: error,
    });
  }
};

const reader_auth = async (req, res, next) => {
  try {
    //   get the token from the authorization header
    const access_token = await req.headers.authorization.split(" ")[1];

    //check if the token matches the supposed origin
    const decodedToken = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET_KEY);

    // retrieve the user details of the logged in user
    const user = await decodedToken;

    checkingReader(user.user_id)
      .then((result) => {
        req.userInfo = result;
        next();
      })
      .catch((err) => {
        res.status(401).json({
          error: err,
        });
        console.log(err);
      });
  } catch (error) {
    console.log("error: ", error);
    res.status(401).json({
      error: error,
    });
  }
};

module.exports = { admin_auth, emp_auth, reader_auth };
