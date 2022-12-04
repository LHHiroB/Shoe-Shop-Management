const express = require("express");
const router = express.Router();
const { Customer } = require("../models/customer");

router.get("/list", async (req, res) => {
  var customers = await Customer.find({}).populate({
    path: "listOrders",
    select: "orderTotal status",
  });
  if (customers) {
    res.status(200).send(customers);
  } else {
    res.status(500).send("Bad server");
  }
});

//Create new customerModel
router.post("/create", async (req, res) => {
  console.log("Post create customer");
  let customer = Customer({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    email: req.body.email,
    point: req.body.point,
    gender: req.body.gender,
  });
  customer
    .save()
    .then((newCustomer) => {
      res.status(200).send(newCustomer);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
//select top 1 customer by point
router.get("/getTopCustomerByPoint/:limit", async function (req, res) {
  var customer = await Customer.find()
    .sort({ point: -1 })
    .limit(parseInt(req.params.limit));
  if (customer) {
    res.status(200).send(customer);
  } else {
    res.status(500).send("Lỗi server");
  }
});
module.exports = router;
