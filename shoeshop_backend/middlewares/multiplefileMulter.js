const multer = require("multer");

const path = require("path");

const storage = multer.memoryStorage();
const multipleMulterUploads = multer({ storage }).array("images", 2);

module.exports = { multipleMulterUploads };
