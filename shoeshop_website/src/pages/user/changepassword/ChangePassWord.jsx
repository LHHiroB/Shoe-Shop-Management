import React, { useState, useEffect } from "react";

import axios from "axios";
import { useHistory, useLocation } from "react-router";
import "./changepassword.css";
import { Link } from "react-router-dom";
import useFormChangePassWord from "./useFormChangePassWord";
import validatePassWord from "./validatePassWord";
const ChangePassWord = () => {
  const history = useHistory();
  const location = useLocation();
  const userLocal = location.state.user;
  const [user, setUser] = useState({
    username: userLocal.username,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const submitForm = () => {
    console.log(user);

    //post to API
    axios
      .post("https://deloy-backend-shoeshop.onrender.com/api/users/changePass", user)
      .then((res) => {
        alert("Cập nhật mật khẩu thành công");
      })
      .catch((err) => {
        console.log(err.response);
        alert(
          "Cập nhật mật khẩu thất bại, mật khẩu bạn vừa nhập là không chính xác"
        );
      });
  };
  const { handleChange, handleSubmit, errors } = useFormChangePassWord(
    submitForm,
    user,
    setUser,
    validatePassWord
  );
  console.log(errors);
  return (
    <div className="change-password">
      <div className="change-password-container">
        <div className="change-password-title ">
          <p>Đổi mật khẩu</p>
        </div>
        <div className="change-password-input-container">
          <div className="change-password-row">
            <input
              name="currentPassword"
              value={user.currentPassword}
              onChange={handleChange}
              placeholder="Nhập mật khẩu cũ"
              type="password"
              className={`change-password-input  ${
                errors.currentPassword ? "error active" : ""
              }`}
            />
            <p className="change-password-form-error">
              {errors.currentPassword}
            </p>
          </div>

          <div className="change-password-row">
            <input
              name="newPassword"
              value={user.newPassword}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới"
              className={`change-password-input  ${
                errors.newPassword ? "error active" : ""
              }`}
              type="password"
            />

            <p className="change-password-form-error">{errors.newPassword}</p>
          </div>
          <div className="change-password-row">
            <input
              name="confirmPassword"
              value={user.confirmPassword}
              type="password"
              onChange={handleChange}
              placeholder="Xác nhận mật khẩu"
              className={`change-password-input  ${
                errors.confirmPassword ? "error active" : ""
              }`}
            />
            <p className="change-password-form-error">
              {errors.confirmPassword}
            </p>
          </div>
          <Link
            to={{
              pathname: "./editProfile",
              state: { user: userLocal },
            }}
          >
            <div className="change-password-close-btn">
              <i style={{ color: "#fff" }} class="fas fa-times"></i>
            </div>
          </Link>
        </div>

        <button onClick={handleSubmit} className="btn-change-password">
          Đồng ý
        </button>
      </div>
    </div>
  );
};

export default ChangePassWord;
