var express = require("express");
var router = express.Router();

const NotificationController = require("../app/controllers/NotificationController");
const { reader_auth, emp_auth, admin_auth } = require("../auth/auth");

// reader role

router.get("/by-employee", emp_auth, NotificationController.getNotificationsByEmployee);
router.get("/by-reader", reader_auth, NotificationController.getNotificationsByReader);

module.exports = router;
