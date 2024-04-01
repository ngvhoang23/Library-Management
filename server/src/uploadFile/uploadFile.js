const multer = require("multer");
const path = require("path");
const { generateString } = require("../DefinedFunctions");

const storageUserAvatar = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./src/public/user-avatars/");
  },
  filename: (req, file, callBack) => {
    const randomString = generateString(file.originalname.length);
    callBack(null, `${file.fieldname}-${Date.now()}-${randomString}.png`);
  },
});

const uploadUserAvatar = multer({
  storage: storageUserAvatar,
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
});

const storageCoverPhoto = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./src/public/book-cover-photos/");
  },
  filename: (req, file, callBack) => {
    const randomString = generateString(file.originalname.length);
    callBack(null, `${file.fieldname}-${Date.now()}-${randomString}.png`);
  },
});

const uploadCoverPhoto = multer({
  storage: storageCoverPhoto,
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
});

module.exports = {
  uploadUserAvatar,
  uploadCoverPhoto,
};
