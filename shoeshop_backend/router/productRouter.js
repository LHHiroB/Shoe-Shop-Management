const express = require("express");
const router = express.Router();

const { Category } = require("../models/product");
const { Product } = require("../models/product");
const generateQR = require("../middlewares/gererateQR");
const { multerUploads, multerExcel } = require("../middlewares/multer");
const { multipleMulterUploads } = require("../middlewares/multiplefileMulter");
const { cloudinary } = require("../config/cloudinary");
const getFileBuffer = require("../middlewares/getFileBuffer");
const path = require("path");
var ObjectId = require("mongoose").Types.ObjectId;
const excelToJson = require("convert-excel-to-json");
const fs = require("fs");
const { send } = require("process");

const urlDefault =
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhlc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80";

router.get("/listCategory", async (req, res) => {
  const name = req.query.name;
  var categories = await Category.find({ name: new RegExp("^" + name, "i") });
  if (categories) {
    res.status(200).send(categories);
  } else {
    res.status(500).send("Bad server");
  }
});
router.get("/getAllCategories", async function (req, res) {
  var categories = await Category.find();
  if (categories) {
    res.status(200).send(categories);
  } else {
    res.status(500).send("Bad server");
  }
});

router.post("/find", (req, res) => {
  const text = req.body.searchText;
  if (ObjectId.isValid(req.body.text)) {
    return Product.find(
      {
        $or: [{ name: new RegExp(text, "i") }, { _id: req.body.text }],
      },
      function (err, result) {
        if (err) throw err;
        console.log(result);
        res.status(200).send(result);
      }
    );
  } else {
    return Product.find(
      { name: new RegExp(text, "i") },
      function (err, result) {
        if (err) throw err;
        res.status(200).send(result);
      }
    );
  }
});

//List product by id
router.get("/productByCategory/", async (req, res) => {
  const category = req.query.category;

  if (category == "Tất cả" || category == "all") {
    var products = await Product.find();
    if (products) {
      res.status(200).send([{ productList: products }]);
    } else {
      res.status(500).send("Bad server");
    }
  } else {
    await Category.aggregate(
      [
        {
          $match: {
            name: category,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "categoryId",
            as: "productList",
          },
        },
      ],
      function (err, result) {
        if (err) return res.status(500).send(err);
        else return res.status(200).send(result);
      }
    );
  }
});

//Get list of products
router.get("/listProduct", async (req, res) => {
  var products = await Product.find();
  if (products) {
    res.status(200).send(products);
  } else {
    res.status(500).send("Bad server");
  }
});

// Done
router.post("/import", multerExcel, async (req, res) => {
  console.log(req.file);
  //Xóa file sau xử lý
  async function deleteFile() {
    await fs.unlink(req.file.path, (err) => {
      if (err) throw err;
      return console.log("Successfully delete file excel!!");
    });
    return;
  }
  try {
    const excelData = await excelToJson({
      sourceFile: req.file.path,
      sheets: [
        {
          name: "Products",
          header: {
            rows: 1,
          },
          columnToKey: {
            A: "name",
            B: "category",
            C: "size",
            D: "quantity",
            E: "originPrice",
            F: "costPrice",
            G: "discount",
            H: "salePrice",
          },
        },
      ],
    }).Products;
    console.log(excelData);
    if (excelData.length == 0) {
      deleteFile();
      return res
        .status(500)
        .send("File không có dữ liệu hoặc không đúng định dạng!!");
    }

    //Import data

    for (var i = 0; i < excelData.length; i++) {
      let cate = await Category.findOne({ name: excelData[i].category });
      if (!cate) {
        console.log("Chạy new category");
        let category = Category({
          name: excelData[i].category,
        });
        await category
          .save()
          .then(async (newCategory) => {
            console.log("Thêm category thành công: ", newCategory);

            const fileQrCode = await generateQR(
              JSON.stringify({
                name: excelData[i].name,
                salePrice: excelData[i].salePrice,
                discount: excelData[i].discount,
              })
            );
            const qrCodeImage = await cloudinary.uploader.upload(fileQrCode, {
              folder: "Linh",
            });
            let product = Product({
              categoryId: newCategory._id,
              name: excelData[i].name,
              costPrice: excelData[i].costPrice,
              discount: excelData[i].discount,
              salePrice: excelData[i].salePrice,
              originPrice: excelData[i].originPrice,
              imageDisplay: urlDefault,
              qrCodeUrl: qrCodeImage ? qrCodeImage.url : "",
              options: [
                {
                  size: excelData[i].size,
                  quantity: excelData[i].quantity,
                },
              ],
            });
            await product
              .save()
              .then((newProduct) => {
                console.log("Thêm product thành công: ", newProduct);
              })
              .catch((err) => {
                return res.status(500).json({
                  status: "Add product failed!!",
                  excelRow: i,
                  err: err,
                });
              });
          })
          .catch((err) => {
            return res.status(500).json({
              status: "Add new category failed!!",
              excelRow: i,
              err: err,
            });
          });
      } else {
        console.log("Không thêm category");
        let prd = await Product.findOne({
          name: excelData[i].name,
          "options.size": excelData[i].size,
        });
        if (prd) {
          //Cập nhật số lượng size
          console.log(
            "Đã tồn tại product và size này => Cập nhật số lượng của size"
          );
          await Product.findOneAndUpdate(
            { _id: prd._id, "options.size": excelData[i].size },
            {
              $set: {
                "options.$.quantity":
                  prd.options.filter(function (prd) {
                    return prd.size === excelData[i].size;
                  })[0].quantity + excelData[i].quantity,
              },
            },
            { new: true }
          )
            .then((result) => {
              console.log("Product sau cập nhật: ", result);
            })
            .catch((err) => {
              console.log(
                "Cập nhật quantity thất bại:",
                excelData[i].name,
                excelData[i].size
              );
              return res.status(500).json({
                status: "Update quantity failed",
                excelRow: i,
                err: err,
              });
            });
        } else {
          console.log(
            "Không tồn tại product và size này",
            excelData[i].name,
            "  ",
            excelData[i].size
          );
          console.log("=>Thêm");
          await Product.findOneAndUpdate(
            { name: excelData[i].name },
            {
              $push: {
                options: {
                  size: excelData[i].size,
                  quantity: excelData[i].quantity,
                },
              },
            },
            { new: true }
          )
            .then(async (result) => {
              if (result) {
                console.log("Push size mới thành công:", excelData[i]);
                console.log("Sản phẩm sau cập nhật:", result);
              } else {
                const fileQrCode = await generateQR(
                  JSON.stringify({
                    name: excelData[i].name,
                    salePrice: excelData[i].salePrice,
                    discount: excelData[i].discount,
                  })
                );
                const qrCodeImage = await cloudinary.uploader.upload(
                  fileQrCode,
                  {
                    folder: "Linh",
                  }
                );
                console.log(
                  "Không tồn tại product name này => tạo product mới"
                );
                let product = Product({
                  categoryId: cate._id,
                  name: excelData[i].name,
                  costPrice: excelData[i].costPrice,
                  discount: excelData[i].discount,
                  salePrice: excelData[i].salePrice,
                  originPrice: excelData[i].originPrice,
                  imageDisplay: urlDefault,
                  qrCodeUrl: qrCodeImage ? qrCodeImage.url : "",
                  options: [
                    {
                      size: excelData[i].size,
                      quantity: excelData[i].quantity,
                    },
                  ],
                });
                await product
                  .save()
                  .then((newProduct) => {
                    console.log("Thêm product mới thành công: ", newProduct);
                  })
                  .catch((err) => {
                    console.log("Thêm product mới thất bại!");
                    return res.status(500).json({
                      status: "Add new product failed!!",
                      excelRow: i,
                      err: err,
                    });
                  });
              }
            })
            .catch(async (error) => {
              return res.status(500).json({
                status: "Push new size failed!! ",
                excelRow: i,
                err: error,
              });
            });
        }
      }
    }
    deleteFile();
    return res.status(200).send("Import dữ liệu thành công");
  } catch {
    deleteFile();
    return res
      .status(500)
      .send("File không có dữ liệu hoặc không đúng định dạng!!");
  }
});

router.post("/img/updates", async (req, res) => {
  Product.findByIdAndUpdate(
    { _id: req.body.productId },
    { $push: { imageDisplay: req.body.imageDisplay } },
    { new: true }
  )
    .then((result) => {
      return res.status(201).json({
        status: "Success",
        message: "Successfully!",
        data: result,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "Failed",
        message: "Database Error",
        data: error,
      });
    });
});

//Delete some products by Id
router.delete("/deleteSomebyId", async (req, res) => {
  console.log(req.body);
  console.log(req.body.id.length);
  ids = req.body.id;
  for (let i = 0; i < req.body.id.length; i++) {
    await Product.findByIdAndRemove(req.body.id[i])
      .then((result) => {
        if (!result) console.log(req.body.id[i], "Product Id không tồn tại");
        else console.log(req.body.id[i], " Done!!!");
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send(err);
      });
  }
  return res.status(500).json({
    status: "Deleted product!",
    id: ids,
  });
});

//Delete product by Id
router.delete("/deleteOnebyId/:id", async (req, res) => {
  await Product.findByIdAndRemove(req.params.id)
    .then((result) => {
      console.log("Removed Product: ", result);
      res.status(200).send("Removed Product:" + result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

router.post("/add", multerUploads, async (req, res) => {
  const fileQrCode = await generateQR(
    JSON.stringify({
      name: req.body.name,
      salePrice: req.body.salePrice,
      discount: req.body.discount,
    })
  );
  const urlDefault =
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhlc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80";
  if (req.file) {
    const buffer = req.file.buffer;
    const fileAvatar = getFileBuffer(
      path.extname(req.file.originalname),
      buffer
    );

    //upload file to clould
    var image = await cloudinary.uploader.upload(fileAvatar, {
      folder: "Linh",
    });
  }

  var qrCodeImage = await cloudinary.uploader.upload(fileQrCode, {
    folder: "Linh",
  });

  if (req.body.newCategory == "true") {
    console.log("Chạy new category");
    let category = Category({
      name: req.body.categoryName,
    });
    await category
      .save()
      .then((newCategory) => {
        let product = Product({
          categoryId: newCategory._id,
          name: req.body.name,
          costPrice: req.body.costPrice,
          discount: req.body.discount,
          salePrice: req.body.salePrice,
          originPrice: req.body.originPrice,
          imageDisplay: image ? image.url : urlDefault,
          qrCodeUrl: qrCodeImage ? qrCodeImage.url : "",
          options: req.body.options,
        });
        product.save().then((newProduct) => {
          res.status(200).send(newProduct);
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({
          err: err,
          status: "Add new category failed!!",
        });
      });
  } else {
    console.log("Không thêm category");
    cata = await Category.findById(req.body.categoryId);
    if (!cata) return res.status(500).send("Category Id không hợp lệ");
    let product = Product({
      categoryId: req.body.categoryId,
      name: req.body.name,
      costPrice: req.body.costPrice,
      discount: req.body.discount,
      salePrice: req.body.salePrice,
      originPrice: req.body.originPrice,

      imageDisplay: image ? image.url : urlDefault,
      qrCodeUrl: qrCodeImage ? qrCodeImage.url : "",
      options: req.body.options,
    });
    await product
      .save()
      .then((newProduct) => {
        console.log("Lưu thành công product mới");
        res.status(200).send(newProduct);
      })
      .catch(async (err) => {
        console.log(err);
        if (image) {
          await cloudinary.uploader.destroy(
            image.public_id,
            function (err, result) {
              if (err) {
                res.status(500).send(err);
              }
            }
          );
          await cloudinary.uploader.destroy(
            qrCodeImage.public_id,
            function (err, result) {
              if (err) {
                res.status(500).send(err);
              }
            }
          );
        }
        res.status(400).send({
          err: err,
          status: "Add new product failed!!",
        });
      });
  }
});

router.put("/updateProduct/:id", multerUploads, async (req, res) => {
  var prd = await Product.findById(req.params.id);

  var fieldToUpdate = {};
  if (!prd) {
    console.log("Product Id incorrect!");
    return res.status(500).send("Product Id incorrect!");
  }
  //if have image, update image
  if (req.file) {
    const buffer = req.file.buffer;
    const fileImageDisplay = getFileBuffer(
      path.extname(req.file.originalname),
      buffer
    );
    var imageDisplay = await cloudinary.uploader.upload(fileImageDisplay, {
      folder: "Linh",
    });
    fieldToUpdate = { ...fieldToUpdate, imageDisplay: imageDisplay.url };
  }
  //If name exist on system=> no create QR code, else create QR code
  if (req.body.name && prd.name !== req.body.name) {
    const fileQrCode = await generateQR(
      JSON.stringify({
        name: req.body.name,
        salePrice: req.body.salePrice,
        discount: req.body.discount,
      })
    );
    var qrCodeImage = await cloudinary.uploader.upload(fileQrCode, {
      folder: "Linh",
    });
    const qrCodeUrl = qrCodeImage.url;
    const name = req.body.name;
    fieldToUpdate = { ...fieldToUpdate, qrCodeUrl, name };
  }

  fieldToUpdate = {
    ...fieldToUpdate,
    costPrice: req.body.costPrice || prd.costPrice,
    salePrice: req.body.salePrice || prd.salePrice,
    discount: req.body.discount || prd.discount,
    originPrice: req.body.originPrice || prd.originPrice,
    options: req.body.options || prd.options,
    categoryId: req.body.categoryId || prd.categoryId,
  };
  const filter = { _id: req.params.id };
  console.log(req.params.id);
  // console.log(fieldToUpdate);
  Product.findOneAndUpdate(filter, fieldToUpdate, { new: true }, (err, doc) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(doc);
  });
});

module.exports = router;
