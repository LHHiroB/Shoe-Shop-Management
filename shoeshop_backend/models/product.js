const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
//Category
let category_Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

//Product
let product_Schema = new Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  originPrice: {
    type: Number,
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  salePrice: {
    type: Number,
    required: true,
  },

  imageDisplay: {
    type: String,
  },
  qrCodeUrl: {
    type: String,
  },
  options: [
    {
      size: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});
category_Schema.plugin(uniqueValidator);
product_Schema.plugin(uniqueValidator);

exports.Category = mongoose.model("Category", category_Schema);
exports.Product = mongoose.model("Product", product_Schema);
