const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let returnOrderDetail_Schema = new Schema({
  orderDetail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderDetail",
    required: true,
  },
  returnedQuantity: {
    type: Number,
    required: true,
  },
  oldQuantity: {
    type: Number,
    required: true,
  },
});
exports.ReturnOrderDetail = mongoose.model(
  "ReturnOrderDetail",
  returnOrderDetail_Schema
);
