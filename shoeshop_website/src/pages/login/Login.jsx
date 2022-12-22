import React, { useState, useEffect } from "react";
import validateUser from "./validateUser";
import useFormLogin from "./useFormLogin";
import axios from "axios";
import { useHistory } from "react-router";
import "./login.css";
import { Link } from "react-router-dom";
const Login = ({ setIsAuticated }) => {
  const history = useHistory();
  const [errorLogin, setErorLogin] = useState("");
  const submitForm = () => {
    axios
      .post("https://deloy-backend-shoeshop.onrender.com/api/users/login", user)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setIsAuticated(true);
        history.push("/home");
      })
      .catch((e) => {
        setErorLogin("Tên tài khoản hoặc mật khẩu không chính xác");
      });

    //Navigate to Screen
    // setIsAuticated(true);
    // history.push("/home");
    // sử dụng jwt để hash token

  };


  const { handleChange, handleSubmit, user, errors } = useFormLogin(
    submitForm,
    validateUser
  );

  return (
    <div className="login-container">
      <div className="login-form">
        <h3 id="login-form-title">ĐĂNG NHẬP</h3>

        <div className="login-form-inputs">
          <input
            value={user.username}
            className="login-form-input"
            type="text"
            placeholder="Tài khoản"
            onChange={handleChange}
            name="username"
          />
          <p className="login-form-error">
          {errors.username}
          </p>
        </div>
        <div className="login-form-inputs">
          <input
            className="login-form-input"
            type="password"
            placeholder="Mật khẩu"
            value={user.password}
            name="password"
            onChange={handleChange}
          />
          <p className="login-form-error">
          {errors.password}
          </p>
        </div>

        <div className="login-form-row login-failed">
          <p>
          {errorLogin}
          </p>
        </div>
        <div className="login-form-item">
          <button 
          onClick={handleSubmit} 
          className="btn-login">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
