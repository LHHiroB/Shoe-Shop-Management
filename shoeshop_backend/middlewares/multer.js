const multer = require("multer");
const path = require("path");
const moment = require("moment");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./file/excel");
  },
  filename: function (req, file, callback) {
    let extension = path.extname(file.originalname);
    let basename = path.basename(file.originalname, extension);
    console.log(file.path);
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const multerUploads = multer({ storage: multer.memoryStorage() }).single(
  "image"
);
const multerExcel = multer({ storage: storage }).single("file");

module.exports = { multerUploads, multerExcel };
