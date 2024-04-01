var express = require("express");
var router = express.Router();

const loginController = require("../app/controllers/LoginController");

router.post("/login", loginController.access);

module.exports = router;
