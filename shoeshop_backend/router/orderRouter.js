const express = require("express");
const { async } = require("q");
const { Customer } = require("../models/customer");
const router = express.Router();
const { Order } = require("../models/order");
const { OrderDetail } = require("../models/order");
const generateQR = require("../middlewares/gererateQR");
const { cloudinary } = require("../config/cloudinary");
const moment = require("moment");
router.get("/list", async (req, res) => {
  var orders = await Order.find()
    .populate({ path: "orderDetails" })
    .populate("customer", "name phone point")
    .populate("user", "fullname")
    .sort({ dateOrder: 1 });
  if (orders) {
    res.status(200).send(orders);
  } else {
    res.status(500).send("Bad server");
  }
});
router.get("/:id", async function (req, res) {
  console.log(req.params.id);
  var order = await Order.findById(req.params.id)
    .populate("customer", "name phone point")
    .populate({
      path: "orderDetails",
      populate: {
        path: "product",
        select: "name saleprice imageDisplay salePrice",
      },
    });

  if (order) {
    res.status(200).send(order);
  } else {
    res.status(500).send("Lỗi server");
  }
});
//Create new Order
router.post("/create", async (req, res) => {
  let order = Order({
    userId: req.body.userId,
    customerId: req.body.customerId,
    subTotal: req.body.subTotal,
    discount: req.body.discount,
    orderTotal: req.body.orderTotal,
  });
  order
    .save()
    .then((newCustomer) => {
      res.status(200).send(newCustomer);
    })
    .catch((err) => {
      res.status(400).send({
        error: err,
        status: "Failure",
      });
    });
});

router.post("/product/add", async (req, res) => {
  let orderDetail = OrderDetail({
    productId: req.body.productId,

    quantity: req.body.quantity,
  });
  orderDetail.save().then(async (newDetails) => {
    const od = await Order.findById({ _id: newDetails.orderId });
    od.list.push(newDetails);
    await od
      .save()
      .then(() => {
        res.status(200).send("Thêm product vào order thành công!");
      })
      .catch((err) => {
        res.status(400).send({
          err: err,
          status: "Failure",
        });
      });
  });
});
router.post("/", async function (req, res) {
  const orderDetails = req.body.orderDetails;
  const orderDetailIds = [];
  var newOrderDetails = await OrderDetail.insertMany(orderDetails);
  newOrderDetails.map((orderDetail) => {
    orderDetailIds.push(orderDetail._id);
  });

  const order = new Order({
    user: req.body.user,
    customer: req.body.customer,
    subTotal: req.body.subTotal,
    discount: req.body.discount,
    orderTotal: req.body.orderTotal,
    orderDetails: orderDetailIds,
    status: "Đã thanh toán",
  });

  order.save(async function (err, order) {
    if (err) {
      console.log("Loi Order");
      console.log(err);
      res.status(500).send(err);
    } else {
      const fileQrCode = await generateQR(
        JSON.stringify({
          orderId: order._id,
          customerId: req.body.customer,
          orderTotal: req.body.orderTotal,
          discount: req.body.discount,
          point: req.body.point,
        })
      );
      var qrCodeImage = await cloudinary.uploader.upload(fileQrCode, {
        folder: "Linh",
      });
      const qrCodeUrl = qrCodeImage.url;
      orderWithQr = await Order.findOneAndUpdate(
        { _id: order.id },
        { qrCodeUrl: qrCodeUrl },
        { returnOriginal: false }
      );
      console.log(orderWithQr);
      res.status(200).send(orderWithQr);
      var updateInfo = await Customer.updateOne(
        {
          _id: req.body.customer,
        },
        { $push: { listOrders: order._id }, point: req.body.point }
      );

      if (updateInfo.modifiedCount) {
        console.log("Thêm order vào khách hàng thành công");
      } else {
        console.log("Thêm đơn hàng vào khách hàng thất bại");
      }
    }
  });
});

//get total revenue today
router.get("/revenue/revenueToday", async function (req, res) {
  var startOfDate = new Date();
  var endOfDate = new Date();

  startOfDate.setHours(startOfDate.getHours() + 7);
  endOfDate.setHours(endOfDate.getHours() + 7);
  startOfDate.setUTCHours(0, 0, 0, 0);
  endOfDate.setUTCHours(0, 0, 0, 0);
  startOfDate.setHours(startOfDate.getHours() - 7);
  endOfDate.setHours(endOfDate.getHours() - 7);
  endOfDate.setDate(startOfDate.getDate() + 1);
  console.log({ startOfDate, endOfDate });
  const agg = Order.aggregate([
    {
      $match: {
        dateOrder: {
          $gte: startOfDate,
          $lt: endOfDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: { $subtract: ["$orderTotal", "$totalReturnPrice"] } },
        dateOrder: { $first: "$dateOrder" },
      },
    },
  ]).exec((err, doc) => {
    if (doc) {
      res.send(doc);
    } else {
      res.send(err);
    }
  });
});
//get top  product
router.get("/revenue/getTopProductByRevenue/:limit", async function (req, res) {
  var startOfDate = new Date();
  var endOfDate = new Date();

  startOfDate.setHours(startOfDate.getHours() + 7);
  endOfDate.setHours(endOfDate.getHours() + 7);
  startOfDate.setUTCHours(0, 0, 0, 0);
  endOfDate.setUTCHours(0, 0, 0, 0);
  startOfDate.setHours(startOfDate.getHours() - 7);
  endOfDate.setHours(endOfDate.getHours() - 7);
  endOfDate.setDate(startOfDate.getDate() + 1);

  console.log({ startOfDate, endOfDate });

  const totalResult = await Order.aggregate([
    {
      $match: {
        dateOrder: {
          $gte: startOfDate,
          $lt: endOfDate,
        },
      },
    },
    {
      $lookup: {
        from: "orderdetails", // update your actual product collection name
        localField: "orderDetails",
        foreignField: "_id",
        as: "orderDetails",
      },
    },
    { $unwind: "$orderDetails" },
    {
      $lookup: {
        from: "products",
        localField: "orderDetails.product",
        foreignField: "_id",
        as: "orderDetails.product",
      },
    },
    { $unwind: "$orderDetails.product" },

    {
      $group: {
        _id: "$orderDetails.product._id",
        count: { $sum: "$orderDetails.quantity" },
        totalSalePrice: {
          $sum: {
            $multiply: [
              "$orderDetails.quantity",
              "$orderDetails.product.salePrice",
            ],
          },
        },
        dateOrder: { $first: "$dateOrder" },
      },
    },
    { $sort: { totalSalePrice: -1, count: -1 } },
    { $limit: parseInt(req.params.limit) },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: 1,
        totalSalePrice: 1,
        count: 1,

        dateOrder: 1,
        productName: "$product.name",
        salePrice: "$product.salePrice",
      },
    },
  ]).exec((err, doc) => {
    if (doc) {
      res.send(doc);
    } else {
      res.send(err);
    }
  });
});
//get top product by quantity
router.get("/revenue/getTopProductByQuantity/:number", async (req, res) => {
  var startOfDate = new Date();
  var endOfDate = new Date();

  const number = req.params.number;
  startOfDate.setHours(startOfDate.getHours() + 7);
  endOfDate.setHours(endOfDate.getHours() + 7);
  startOfDate.setUTCHours(0, 0, 0, 0);
  endOfDate.setUTCHours(0, 0, 0, 0);
  startOfDate.setHours(startOfDate.getHours() - 7);
  endOfDate.setHours(endOfDate.getHours() - 7);
  endOfDate.setDate(startOfDate.getDate() + 1);
  console.log(req.params.number);
  const totalResult = await Order.aggregate([
    {
      $match: {
        dateOrder: {
          $gte: startOfDate,
          $lte: endOfDate,
        },
      },
    },
    {
      $lookup: {
        from: "orderdetails", // update your actual product collection name
        localField: "orderDetails",
        foreignField: "_id",
        as: "orderDetails",
      },
    },
    { $unwind: "$orderDetails" },
    {
      $lookup: {
        from: "products",
        localField: "orderDetails.product",
        foreignField: "_id",
        as: "orderDetails.product",
      },
    },
    { $unwind: "$orderDetails.product" },

    {
      $group: {
        _id: "$orderDetails.product._id",
        count: { $sum: "$orderDetails.quantity" },
        totalSalePrice: {
          $sum: {
            $multiply: [
              "$orderDetails.quantity",
              "$orderDetails.product.salePrice",
            ],
          },
        },
        dateOrder: { $first: "$dateOrder" },
      },
    },
    { $sort: { count: -1, totalSalePrice: -1 } },
    { $limit: parseInt(req.params.number) },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: 1,
        totalSalePrice: 1,
        count: 1,

        dateOrder: 1,
        productName: "$product.name",
        salePrice: "$product.salePrice",
      },
    },
  ]).exec((err, doc) => {
    if (doc) {
      res.send(doc);
    } else {
      res.send(err);
    }
  });
});
//get Expensive today
router.get("/revenue/getExpensiveToday", function (req, res) {
  var startOfDate = new Date();
  var endOfDate = new Date();

  startOfDate.setHours(startOfDate.getHours() + 7);
  endOfDate.setHours(endOfDate.getHours() + 7);
  startOfDate.setUTCHours(0, 0, 0, 0);
  endOfDate.setUTCHours(0, 0, 0, 0);
  startOfDate.setHours(startOfDate.getHours() - 7);
  endOfDate.setHours(endOfDate.getHours() - 7);
  endOfDate.setDate(startOfDate.getDate() + 1);
  console.log(startOfDate);
  Order.aggregate([
    {
      $match: {
        dateOrder: {
          $gte: startOfDate,
          $lte: endOfDate,
        },
      },
    },
    {
      $lookup: {
        from: "orderdetails",
        localField: "orderDetails",
        foreignField: "_id",
        as: "orderDetails",
      },
    },
    {
      $unwind: "$orderDetails",
    },
    {
      $lookup: {
        from: "products",
        localField: "orderDetails.product",
        foreignField: "_id",
        as: "orderDetails.product",
      },
    },
    { $unwind: "$orderDetails.product" },
    {
      $group: {
        _id: null,

        totalExpensive: {
          $sum: {
            $multiply: [
              "$orderDetails.product.originPrice",
              "$orderDetails.quantity",
            ],
          },
        },

        dateOrder: { $first: "$dateOrder" },
      },
    },
  ]).exec(function (err, doc) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (doc.length > 0) {
        res.status(200).send(doc);
      } else {
        res.json({
          totalExpensive: 0,
          dateOrder: startOfDate,
        });
      }
    }
  });
});
function getMonday(d) {
  d = new Date(d);

  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

router.get("/revenue/getCountOrderToday", function (req, res) {
  var startOfDate = new Date();
  var endOfDate = new Date();

  startOfDate.setHours(startOfDate.getHours() + 7);
  endOfDate.setHours(endOfDate.getHours() + 7);
  startOfDate.setUTCHours(0, 0, 0, 0);
  endOfDate.setUTCHours(0, 0, 0, 0);
  startOfDate.setHours(startOfDate.getHours() - 7);
  endOfDate.setHours(endOfDate.getHours() - 7);
  endOfDate.setDate(startOfDate.getDate() + 1);
  Order.aggregate([
    {
      $match: {
        dateOrder: {
          $gte: startOfDate,
          $lte: endOfDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        countOrder: { $sum: 1 },
        dateOrder: { $first: "$dateOrder" },
      },
    },
  ]).exec(function (err, doc) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(doc);
    }
  });
});
function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}
//create script random date in a week
router.get("/revenue/updateOrder", async function (req, res) {
  //Order.updateMany()
  var orders = await Order.find();
  orders.forEach((order) => {
    console.log(order);
    Order.findByIdAndUpdate(
      order._id,
      {
        dateOrder: randomDate(new Date(2021, 10, 28), new Date()),
      },
      { new: true },
      function (err, doc) {
        if (err) {
          // res.send(err);
        } else {
          //res.send(doc);
        }
      }
    );
  });
  if (orders) {
    res.send(orders);
  }
  // Order.updateMany(
  //   {
  //     dateOrder: randomDate(new Date(2021, 11, 5), new Date(2021, 11, 13)),
  //   },

  //   function (err, order) {
  //     if (err) {
  //       //res.send(err);
  //     } else {
  //       //res.send(order);
  //     }
  //   }
  // );
  console.log(randomDate(new Date(2012, 0, 1), new Date()));
  //res.send(randomDate(new Date(2021, 11, 5), new Date(2021, 11, 13)));
});
router.get("/revenue/getTotalCustomerByThisWeek", function (req, res) {
  const startOfWeek = getMonday(new Date());

  startOfWeek.setUTCHours(0, 0, 0, 0);

  //endOfWeek.setUTCHours(0, 0, 0, 0);
  startOfWeek.setHours(startOfWeek.getHours() - 7);
  console.log(startOfWeek);
  Order.aggregate([
    {
      $match: {
        dateOrder: {
          $gte: startOfWeek,
        },
      },
    },
    {
      $project: {
        dateOrder: "$dateOrder",
      },
    },
    {
      $sort: {
        dateOrder: 1,
      },
    },
  ]).exec(function (err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});
router.get("/revenue/getTotalCustomerByLastWeek", function (req, res) {
  const startDate = new Date();
  const endDate = new Date();

  startDate.setDate(startDate.getDate() - 7);
  console.log(startDate);
  const startOfWeek = getMonday(startDate);
  const endOfWeek = getMonday(endDate);
  console.log(endOfWeek);
  startOfWeek.setUTCHours(0, 0, 0, 0);
  endOfWeek.setUTCHours(0, 0, 0, 0);
  startOfWeek.setHours(startOfWeek.getHours() - 7);
  endOfWeek.setHours(endOfWeek.getHours() - 7);
  console.log({ startOfWeek, endOfWeek });
  Order.aggregate([
    {
      $match: {
        dateOrder: {
          $gte: startOfWeek,
          $lt: endOfWeek,
        },
      },
    },
    {
      $project: {
        dateOrder: "$dateOrder",
      },
    },
    {
      $sort: {
        dateOrder: 1,
      },
    },
  ]).exec(function (err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});
module.exports = router;
