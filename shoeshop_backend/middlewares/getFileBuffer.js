const DatauriParser = require("datauri/parser");
const getFileBuffer = (extension, buffer) => {
  const parser = new DatauriParser();
  parser.format(extension, buffer);
  return parser.content;
};
module.exports = getFileBuffer;
