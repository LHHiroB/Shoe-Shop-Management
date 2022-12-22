import React, { useState, useRef } from "react";
import "./AddStaff.css";

import TextField from "@mui/material/TextField";
import DatePicker from "react-date-picker";

import useFormStaff from "./useFormStaff";
import validateStaff from "./validateStaff";
import axios from "axios";

const AddStaff = ({ setShowFormAddStaff }) => {
  const inputAvatarRef = useRef(null);
  const birthdayRef = useRef(null);
  const [staff, setStaff] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    birthday: new Date(),
    sex: "",
    email: "",
    fullname: "",
    gender: "Nam",
    position: "Nhân viên thu ngân",
  });

  //Call API
  const submitForm = () => {
    var formStaff = new FormData();
    formStaff.append("username", staff.username);
    formStaff.append("password", staff.password);
    formStaff.append("fullname", staff.fullname);
    formStaff.append("address", staff.address);
    formStaff.append("birthday", staff.birthday);
    formStaff.append("gender", staff.gender);
    formStaff.append("position", staff.position);
    formStaff.append("email", staff.email);
    formStaff.append("phone", staff.phone);
    formStaff.append("image", avatar);

    //post to API
    axios
      .post(
        "https://deloy-backend-shoeshop.onrender.com/api/users/register",
        formStaff,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        },
        { timeout: 1000 }
      )
      .then((res) => {
        alert("Thêm nhân viên thành công");
        setShowFormAddStaff(false);
      })
      .catch((err) => {
        alert("Thêm nhân viên thất bại");
      });
  };
  const { handleChange, handleChangeBirthday, handleSubmit, errors } =
    useFormStaff(submitForm, staff, setStaff, validateStaff);
  const [avatar, setAvatar] = useState();
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0]);
    }
  };
  const onExitClick = () => {
    setShowFormAddStaff(false);
  };

  return (
    <div className="add_staff-container">
      <div className="add_staff-heading">
        <h3 className="add_staff-heading-title">Thêm mới nhân viên</h3>
        <div className="add_staff-heading-info">
          <p>Thông tin</p>
          <div className="line-add"></div>
        </div>
        <div onClick={onExitClick} className="add_staff-btn-exit">
          X
        </div>
      </div>
      <div className="add_staff-body">
        <div className="add_staff_img">
          <img
            src={
              avatar
                ? URL.createObjectURL(avatar)
                : "https://res.cloudinary.com/hoquanglinh/image/upload/v1635330645/profile_ieghzz.jpg"
            }
            alt=""
            className="add_staff-avatar"
          />
          <input
            ref={inputAvatarRef}
            type="file"
            onChange={onImageChange}
            style={{ display: "none" }}
          />
          <button
            className="btn-pickImage"
            onClick={() => {
              inputAvatarRef.current.click();
            }}
          >
            Chọn ảnh
          </button>
        </div>
        <div className="add_staff-form">
          <div className="add_staff-form-row">
            <span>Tên tài khoản</span>
            <input
              className={errors.username ? "error" : ""}
              onChange={handleChange}
              name="username"
              value={staff.username}
              type="text"
            />
            <p className="add_staff-form-error">{errors.username}</p>
          </div>
          <div className="add_staff-form-row">
            <span>Ngày sinh</span>
            <p className="add_staff-form-error">{errors.birthday}</p>

              <DatePicker
                className="container__date"
                format="dd/MM/yyyy"
                inputFormat="dd/MM/yyyy"
                ref={birthdayRef}
                views={["day", "month", "year"]}
                value={staff.birthday}
                name="birthday"
                onChange={handleChangeBirthday}
                renderInput={(params) => (
                  <TextField
                    open
                    fullWidth
                    size="small"
                    style={{
                      height: "100%",
                      width: "206px",
                      borderRadius: 5,
                      zIndex: 4,
                      border: "1px solid #4e5052",
                    }}
                    {...params}
                  />
                )}
              />
          </div>
          <div className="add_staff-form-row">
            <span>Mật khẩu</span>
            <input
              className={errors.password ? "error" : ""}
              onChange={handleChange}
              type="password"
              value={staff.password}
              name="password"
            />
            <p className="add_staff-form-error">{errors.password}</p>
          </div>

          <div className="add_staff-form-row">
            <span>Giới tính</span>

            <select
              value={staff.gender}
              className="add_staff-form-select"
              name="gender"
              onChange={handleChange}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div className="add_staff-form-row">
            <span>Xác nhận mật khẩu</span>
            <input
              type="password"
              name="confirmPassword"
              value={staff.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
            />
            <p className="add_staff-form-error">{errors.confirmPassword}</p>
          </div>
          <div className="add_staff-form-row">
            <span>Chức vụ</span>
            <select
              value={staff.position}
              onChange={handleChange}
              className="add_staff-form-select"
              name="position"
              id="active"
            >
              <option value="Nhân viên thu ngân">Nhân viên thu ngân</option>
              <option value="Nhân viên kho">Nhân viên kho</option>
            </select>
          </div>
          <div className="add_staff-form-row">
            <span>Họ tên</span>
            <input
              name="fullname"
              onChange={handleChange}
              value={staff.fullname}
              className={errors.fullname ? "error" : ""}
              type="text"
            />
            <p className="add_staff-form-error">{errors.fullname}</p>
          </div>
          <div className="add_staff-form-row">
            <span>Email</span>
            <input
              name="email"
              onChange={handleChange}
              value={staff.value}
              type="text"
              className={errors.email ? "error" : ""}
            />
            <p className="add_staff-form-error">{errors.email}</p>
          </div>
          <div className="add_staff-form-row">
            <span>Địa chỉ</span>
            <input
              name="address"
              onChange={handleChange}
              value={staff.address}
              className={errors.address ? "error" : ""}
              type="text"
            />
            <p className="add_staff-form-error">{errors.address}</p>
          </div>
          <div className="add_staff-form-row">
            <span>Số điện thoại</span>
            <input
              name="phone"
              value={staff.phone}
              onChange={handleChange}
              className={errors.phone ? "error" : ""}
              type="text"
            />
            <p className="add_staff-form-error">{errors.phone}</p>
          </div>
        </div>
      </div>
      <div className="add_staff-btn-row">
        <button onClick={handleSubmit} className="add_staff-btn-save">
          Lưu
        </button>
        <button onClick={onExitClick} className="add_staff-btn-cancel">
          Bỏ qua
        </button>
      </div>
    </div>
  );
};

export default AddStaff;