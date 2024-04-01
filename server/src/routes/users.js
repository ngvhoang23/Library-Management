var express = require("express");
var router = express.Router();

const { uploadUserAvatar } = require("../uploadFile/uploadFile");

const UserController = require("../app/controllers/UserController");
const EmployeeController = require("../app/controllers/EmployeeController");
const ReaderController = require("../app/controllers/ReaderController");
const { reader_auth, emp_auth, admin_auth } = require("../auth/auth");

router.get("/user-info", reader_auth, UserController.getUserInfo);

router.get("/employees", EmployeeController.getEmployees);
router.get("/employees/searching/:search_value", EmployeeController.searchEmployees);
router.get("/employees/:user_id", EmployeeController.getEmployeesById);
router.post("/employee", uploadUserAvatar.single("avatar"), EmployeeController.postEmployee);
router.put("/employee", uploadUserAvatar.single("avatar"), EmployeeController.editEmployee);
router.delete("/employee", EmployeeController.deleteEmployee);

router.get("/readers", ReaderController.getReaders);
router.get("/readers/searching/:search_value", ReaderController.searchReaders);
router.get("/readers/:user_id", ReaderController.getReaderById);
router.post("/reader", uploadUserAvatar.single("avatar"), ReaderController.postReader);
router.put("/reader", uploadUserAvatar.single("avatar"), ReaderController.editReader);
router.put("/reader-status", ReaderController.makeReaderActive);
router.delete("/reader", ReaderController.deleteReader);

router.put("/password-by-admin", UserController.changePasswordByAdmin);
router.put("/password", reader_auth, UserController.changePasswordUser);

module.exports = router;
