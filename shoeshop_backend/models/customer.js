const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

let customer_Schema = new Schema({
  name: {
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
  point: {
    type: Number,
    default: 0,
  },
  listOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

customer_Schema.plugin(uniqueValidator);
exports.Customer = mongoose.model("Customer", customer_Schema);
