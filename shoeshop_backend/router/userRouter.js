const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { multerUploads } = require("../middlewares/multer");
const { cloudinary } = require("../config/cloudinary");
const { multipleMulterUploads } = require("../middlewares/multiplefileMulter");
const getFileBuffer = require("../middlewares/getFileBuffer");
const path = require("path");
//Hash Pass
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

router.get("/", (request, response) => {
  User.find({})
    .select("-password")
    .exec(function (err, users) {
      response.send(users);
    });
});

//login
router.post("/login", async function (req, res) {
  let user = await User.findOne({ username: req.body.username });
  if (!req.body.username) {
    return res.status(400).send("Vui lòng nhập tài khoản");
  }
  if (!req.body.password) {
    return res.status(400).send("Vui lòng nhập mật khẩu");
  }
  if (!user) {
    return res.status(400).send("Tài khoản không hợp lệ");
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res
      .status(422)
      .send(
        "Rất tiếc, mật khẩu của bạn không đúng. Vui lòng kiểm tra lại mật khẩu."
      );
  }
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24 * 15,
  });

  res.status(200).send({
    "auth-token": token,
    position: user.position,
    userId: user._id,
    fullname: user.fullname,
  });
});

//Change Password
router.post("/changePass", async function (req, res) {
  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Tài khoản của bạn không tồn tại");
  if (!bcrypt.compareSync(req.body.currentPassword, user.password)) {
    return res
      .status(422)
      .send(
        "Rất tiếc, mật khẩu của bạn không đúng. Vui lòng kiểm tra lại mật khẩu."
      );
  }
  User.findOneAndUpdate(
    { username: req.body.username },
    { password: bcrypt.hashSync(req.body.newPassword, salt) },
    { new: true },
    (error, data) => {
      if (error) {
        return res.status(422).send(error);
      } else {
        return res.status(200).send(data);
      }
    }
  );
});
//Get Info
//Info
router.get("/getInfo/:id", async function (req, res) {
  if (!req.params.id) {
    return res.status(400).send("Error");
  }
  let info = await User.findById(req.params.id).select("-password");
  if (!info) {
    return res.status(422).send("Info not found");
  } else return res.status(200).send(info);
});

//filter user by position
router.get("/getUserByPosition/", function (req, res) {
  const position = req.query.position;
  if (position == "Nhân viên kho" || position == "Nhân viên thu ngân") {
    User.find({ position: req.query.position })
      .select("-password")
      .exec(function (err, users) {
        if (err) {
          res.send(err);
        } else {
          res.send(users);
        }
      });
  } else {
    User.find({})
      .select("-password")
      .exec(function (err, users) {
        if (err) {
          res.send(err);
        } else {
          res.send(users);
        }
      });
  }
});
//save QrImage Url

// Register
router.post("/register", multerUploads, async (req, res) => {
  const urlDefault =
    "https://res.cloudinary.com/hoquanglinh/image/upload/v1635330645/profile_ieghzz.jpg";

  if (req.file) {
    const buffer = req.file.buffer;
    const file = getFileBuffer(path.extname(req.file.originalname), buffer);
    console.log(file);
    //upload file to clould
    var image = await cloudinary.uploader.upload(file, {
      folder: "Linh",
    });
  }
  console.log(req.body);
  let user = User({
    fullname: req.body.fullname,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
    phone: req.body.phone,
    address: req.body.address,
    email: req.body.email,
    imageUrl: image ? image.url : urlDefault,
    position: req.body.position,
    gender: req.body.gender,
    birthday: req.body.birthday,
  });

  user
    .save()
    .then((newUser) => {
      res.status(200).send(newUser);
    })
    .catch(async (err) => {
      if (image) {
        await cloudinary.uploader.destroy(
          image.public_id,
          function (err, result) {
            if (err) {
              res.status(500).send(err);
            }
          }
        );
      }

      res.status(400).send(err);
    });
});
//Update User
router.put("/updateUser/:id", multerUploads, async (req, res) => {
  console.log(req.params.id);
  us = await User.findById(req.params.id);
  if (!us) return res.status(500).send("User id invalid");
  if (req.file) {
    const buffer = req.file.buffer;
    const file = getFileBuffer(path.extname(req.file.originalname), buffer);

    //upload file to clould
    var image = await cloudinary.uploader.upload(file, {
      folder: "Linh",
    });
  }
  console.log(req.body);
  if (image) {
    console.log("Có image");
    var user = {
      fullname: req.body.fullname,
      phone: req.body.phone,
      address: req.body.address,
      email: req.body.email,
      imageUrl: image.url,
      position: req.body.position,
      gender: req.body.gender,
      birthday: req.body.birthday || new Date(),
    };
  } else {
    console.log("Không có image");
    var user = {
      fullname: req.body.fullname,
      phone: req.body.phone,
      address: req.body.address,
      email: req.body.email,
      position: req.body.position,
      gender: req.body.gender,
      birthday: req.body.birthday || new Date(),
    };
  }
  User.findByIdAndUpdate(
    req.params.id,
    user,
    { new: true },
    async function (err, doc) {
      if (err) {
        res.status(400).send(err);
      } else {
        console.log("Cập nhập user thành công");
        res.status(200).send(doc);
      }
    }
  );
});

//filter user by name or by phone
router.get("/filterUser/", function (req, res) {
  const position = req.query.position;
  const phone = req.query.phone;
  const fullname = req.query.fullname;
  console.log(req.query);
  if (req.query) {
    User.find({
      $or: [{ position: position }, { phone: phone }, { fullname: fullname }],
    })
      .select("-password")
      .exec(function (err, users) {
        if (err) {
          res.send(err);
        } else {
          res.send(users);
        }
      });
  } else {
    User.find({})
      .select("-password")
      .exec(function (err, users) {
        if (err) {
          res.send(err);
        } else {
          res.send(users);
        }
      });
  }
});
router.get("/find", async function (req, res) {
  var filter = {};

  if (req.query._id) {
    const _id = new RegExp(req.query._id + "$");
    const users = await User.findById(_id);
    if (users) {
      console.log(users);
      return res.status(200).send(users);
    } else {
      return res.status(404).send("User not found");
    }
  } else {
    if (req.query.name) {
      filter = { ...filter, fullname: new RegExp("^" + req.query.name, "i") };
    }
    var users = await User.find(filter);
    if (users) {
      console.log(users);
      return res.status(200).send(users);
    } else {
      return res.status(404).send("User not found");
    }
  }
});
router.delete("/deleteOnebyId/:id", async function (req, res) {
  if (req.params.id) {
    await User.findByIdAndRemove(req.params.id)
      .then((result) => {
        console.log("Removed user: ", result);
        res.status(200).send("Removed user:" + result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  }
});
module.exports = router;
