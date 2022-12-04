const express = require("express");
const router = express.Router();
const { ReturnOrderDetail } = require("../models/returnOrderDetail");
const { ReturnOrder } = require("../models/returnOrder");
const { OrderDetail, Order } = require("../models/order");
const generateQR = require("../middlewares/gererateQR");
const { cloudinary } = require("../config/cloudinary");
const { Customer } = require("../models/customer");
module.exports = router;

router.get("/", async function (req, res) {
  var returnOrders = await ReturnOrder.find().populate({
    path: "order",
    populate: [
      {
        path: "user",
        select: "fullname",
      },
      {
        path: "customer",
        select: "name phone",
      },
    ],
  });

  if (returnOrders) {
    res.status(200).send(returnOrders);
  } else {
    res.status(500).send("Bad server");
  }
});
router.get("/:id", async function (req, res) {
  var returnOrder = await await ReturnOrder.findById(req.params.id)
    .populate({
      path: "order",
      populate: [
        {
          path: "user",
          select: "fullname",
        },
        {
          path: "customer",
          select: "name phone",
        },
      ],
    })
    .populate({
      path: "returnOrderDetails",
      populate: {
        path: "orderDetail",
        populate: {
          path: "product",
          select: "name salePrice",
        },
      },
    });
  if (returnOrder) {
    res.status(200).send(returnOrder);
  } else {
    res.send(500).send("Lỗi server");
  }
});
router.post("/", async function (req, res) {
  const returnOrderDetails = req.body.returnOrderDetails;

  const returnOrderDetailIds = [];
  for (var i in returnOrderDetails) {
    const quantity =
      returnOrderDetails[i].oldQuantity -
      returnOrderDetails[i].returnedQuantity;
    //if (quantity == 0) {
    console.log(returnOrderDetails[i].orderDetail);
    //OrderDetail.findByIdAndRemove(
    // returnOrderDetails[i].orderDetail,
    // function (err, doc) {
    //  if (doc) {
    //   console.log("Xoá sản phẩm thành công");
    // } else {
    //    console.log("Xoá chi tiết đơn thành công");
    // }
    //  }
    //);
    //} else {
    OrderDetail.findByIdAndUpdate(
      returnOrderDetails[i].orderDetail,
      {
        quantity,
      },
      { new: true },
      function (err, doc) {
        if (err) {
          console.log("Lỗi update");
        } else {
          console.log(doc);
        }
      }
    );
  }

  Order.findByIdAndUpdate(
    req.body.order,
    {
      totalReturnPrice: req.body.totalReturnPrice,

      status: "Đã trả hàng",
    },
    { new: true },
    function (err, doc) {
      if (err) {
        console.log("Lỗi update");
      } else {
        console.log(doc);
      }
    }
  );
  var newReturnOrderDetails = await ReturnOrderDetail.insertMany(
    returnOrderDetails
  );
  newReturnOrderDetails.map((returnOrderDetail) => {
    returnOrderDetailIds.push(returnOrderDetail._id);
  });

  const returnOrder = new ReturnOrder({
    cashier: req.body.user,
    order: req.body.order,
    returnTempPrice: req.body.returnTempPrice,
    returnFee: req.body.returnFee,
    totalReturnPrice: req.body.totalReturnPrice,
    returnOrderDetails: returnOrderDetailIds,
  });

  returnOrder.save(async function (err, returnOrder) {
    if (err) {
      console.log("Loi Order");
      console.log(err);
      res.status(500).send(err);
    } else {
      const fileQrCode = await generateQR(
        JSON.stringify({
          returnOrderId: returnOrder._id,
          customer: req.body.customer,
          returnFee: req.body.returnFee,
          totalReturnPrice: req.body.totalReturnPrice,
          point: req.body.point,
        })
      );
      var qrCodeImage = await cloudinary.uploader.upload(fileQrCode, {
        folder: "Linh",
      });
      const qrCodeUrl = qrCodeImage.url;
      orderWithQr = await ReturnOrder.findOneAndUpdate(
        { _id: returnOrder.id },
        { qrCodeUrl: qrCodeUrl },
        { returnOriginal: false }
      );

      res.status(200).send(orderWithQr);

      var updateInfo = await Customer.updateOne(
        {
          _id: req.body.customer,
        },
        { point: req.body.point }
      );

      if (updateInfo.modifiedCount) {
        console.log("Cập nhật điểm cho khách hàng thành công");
      } else {
        console.log("Cập nhật điểm cho khách hàng thất bại");
      }
    }
  });
});
