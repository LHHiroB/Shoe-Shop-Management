import React, { useState } from "react";
import { styled, Box } from "@mui/system";
import ModalUnstyled from "@mui/core/ModalUnstyled";
import axios from "axios";
import "./addcustomer.css";
import useFormAddCustomer from "./useFormAddCustomer";
import validateCustomer from "./validateCustomer";
const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const AddCustomer = ({ open, handleCancel }) => {
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const submitForm = () => {
    console.log(customer);
    const test = {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    };

    //post to API
    axios
      .post(
        "https://deloy-backend-shoeshop.onrender.com/api/customers/create",
        customer
      )
      .then((res) => {
        alert("Thêm khách hàng thành công");
      })
      .catch((err) => {
        console.log(err.response.data);
        alert(
          "Thêm khách hàng thất bại, tên tài khoản hoặc số điện thoại đã tồn tại trong hệ thống"
        );
      });
  };
  const { handleChange, handleSubmit, errors } = useFormAddCustomer(
    submitForm,
    customer,
    setCustomer,
    validateCustomer
  );

  return (
    <StyledModal
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      open={open}
      close={handleCancel}
      BackdropComponent={Backdrop}
    >
      <div className="add-customer-container">
        <div className="add-customer-title ">
          <p>Thêm khách hàng</p>
        </div>
        <div className="add-customer-input-container">
          <input
            name="name"
            className={`add-customer-input ${
              errors.name ? "error active" : ""
            }`}
            type="text"
            placeholder={errors.name ? errors.name : "Họ và tên"}
            value={customer.name}
            onChange={handleChange}
          />
          <input
            name="phone"
            className={`add-customer-input ${
              errors.phone ? "error active" : ""
            }`}
            type="text"
            value={customer.phone}
            onChange={handleChange}
            placeholder={errors.phone ? errors.phone : "Số điện thoại"}
          />
          <input
            name="email"
            className={`add-customer-input ${
              errors.email ? "error active" : ""
            }`}
            type="text"
            value={customer.email}
            onChange={handleChange}
            placeholder={errors.email ? errors.email : "Email"}
          />
          <div
            onClick={() => {
              handleCancel();
            }}
            className="add-customer-close-btn"
          >
            <i class="fas fa-times"></i>
          </div>
        </div>

        <button onClick={handleSubmit} className="btn-add-customer">
          Đồng ý
        </button>
      </div>
    </StyledModal>
  );
};

export default AddCustomer;