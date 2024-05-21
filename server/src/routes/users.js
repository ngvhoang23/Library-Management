var express = require("express");
var router = express.Router();

const { uploadUserAvatar } = require("../uploadFile/uploadFile");

const UserController = require("../app/controllers/UserController");
const EmployeeController = require("../app/controllers/EmployeeController");
const ReaderController = require("../app/controllers/ReaderController");
const { reader_auth, emp_auth, admin_auth } = require("../auth/auth");

router.post("/register-account", UserController.registerAccount);
router.post("/reset-password", UserController.resetPassword);
router.get("/check-email-user", UserController.checkEmailUser);

router.get("/user-info", reader_auth, UserController.getUserInfo);
router.post("/user-info", reader_auth, uploadUserAvatar.single("avatar"), reader_auth, UserController.postUserInfo);
router.put("/user-info", reader_auth, uploadUserAvatar.single("avatar"), reader_auth, UserController.changeuserInfo);

router.get("/employees", admin_auth, EmployeeController.getEmployees);
router.get("/employees/searching/:search_value", admin_auth, EmployeeController.searchEmployees);
router.get("/employees/:user_id", admin_auth, EmployeeController.getEmployeesById);
router.post("/employee", admin_auth, uploadUserAvatar.single("avatar"), EmployeeController.postEmployee);
router.put("/employee", admin_auth, uploadUserAvatar.single("avatar"), EmployeeController.editEmployee);
router.delete("/employee", admin_auth, EmployeeController.deleteEmployee);

router.get("/readers", emp_auth, ReaderController.getReaders);
router.get("/reader-quantity", emp_auth, ReaderController.getReaderQuantity);
router.get("/readers/searching/:search_value", emp_auth, ReaderController.searchReaders);
router.get("/readers/:user_id", emp_auth, ReaderController.getReaderById);
router.post("/reader", emp_auth, uploadUserAvatar.single("avatar"), ReaderController.postReader);
router.put("/reader", emp_auth, uploadUserAvatar.single("avatar"), ReaderController.editReader);
router.put("/reader-status", emp_auth, ReaderController.makeReaderActive);
router.delete("/reader", emp_auth, ReaderController.deleteReader);

router.put("/password-by-admin", UserController.changePasswordByAdmin);
router.put("/password", reader_auth, UserController.changePasswordUser);

router.post("/email", reader_auth, UserController.changeEmail);

module.exports = router;
