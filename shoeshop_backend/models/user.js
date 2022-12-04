const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

let user_Schema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  position: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,

    default: Date.now,
  },
});

user_Schema.plugin(uniqueValidator);

exports.User = mongoose.model("User", user_Schema);
