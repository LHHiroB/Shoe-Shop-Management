import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

import "./updateProduct.css";
import axios from "axios";
import validateProduct from "../form_validate/validateProduct";
import useFormProduct from "../form_validate/useFormProduct";

const UpdateProduct = ({ product, setProduct, setShowFormUpdateProduct }) => {
  const inputAvatarRef = useRef(null);
  const [avatar, setAvatar] = useState();
  const [categories, setCategories] = useState([]);

  //const test mv

  const [categoryId, setCategoryId] = useState(product.categoryId);

  //get All cateogories
  useEffect(() => {
    axios
      .get("https://deloy-backend-shoeshop.onrender.com/api/products/getAllCategories")
      .then((res) => {
        setCategories(res.data);
      });
  }, []);

  const [options, setOptions] = useState([
    { id: 0, size: "37", quantity: product.options[0]?.quantity || 0 },
    { id: 1, size: "38", quantity: product.options[1]?.quantity || 0 },
    { id: 2, size: "39", quantity: product.options[2]?.quantity || 0 },
    { id: 3, size: "40", quantity: product.options[3]?.quantity || 0 },
    { id: 4, size: "41", quantity: product.options[4]?.quantity || 0 },
    { id: 5, size: "42", quantity: product.options[5]?.quantity || 0 },
   
  ]);

  const handleOptionChecked = (index) => {
    let newOptions = [...options];
    newOptions[index] = {
      ...options[index],
      checked: !newOptions[index].checked,
    };
    setOptions(newOptions);
  };
  const getOption = async () => {
    // const newOptions = options.filter((option) => option.checked == true);
    console.log(options);
    var newOptions = options
      .filter((option) => option.checked === true && option.quantity > 0)
      .map((option) => {
        return {
          size: option.size,
          quantity: option.quantity,
        };
      });

    return newOptions;
  };

  const handleIncreaseDiscount = (e) => {
    setProduct((prev) => {
      if (prev.discount <= 99) {
        const discount = Math.floor(prev.discount) + 1;
        return {
          ...prev,
          discount: discount,
          salePrice: prev.costPrice - (discount * prev.costPrice) / 100,
        };
      } else {
        return prev;
      }
    });
  };

  const handleDecreaseDiscount = (e) => {
    setProduct((prev) => {
      if (prev.discount > 0) {
        const discount = Math.floor(prev.discount) - 1;
        return {
          ...prev,
          discount: discount,
          salePrice: prev.costPrice - (discount * prev.costPrice) / 100,
        };
      } else {
        return prev;
      }
    });
  };

  //active function when choose image from pc
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0]);
    }
  };

  //Submit form
  const submitForm = async () => {
    var optionsVal = await getOption();
    console.log(optionsVal);
    // console.log(categoryId);
    const formProduct = new FormData();
    formProduct.append("categoryId", categoryId);
    formProduct.append("name", product.name);
    formProduct.append("costPrice", product.costPrice);
    formProduct.append("discount", product.discount);
    formProduct.append("salePrice", product.salePrice);
    formProduct.append("originPrice", product.originPrice);

    formProduct.append("image", avatar);

    for (var i = 0; i < optionsVal.length; i++) {
      var optionVal = optionsVal[i];
      for (var prop in optionVal) {
        formProduct.append(`options[${i}][${prop}]`, optionVal[prop]);
      }
    }
    //post to API
    axios
      .put(
        `https://deloy-backend-shoeshop.onrender.com/api/products/updateProduct/${product._id}`,
        formProduct,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        alert("Cập nhật sản phẩm thành công");
        // test
      })
      .catch((error) => {
        if (error.response) {
          alert("Cập nhật sản phẩm thất bại");

          console.log(error.response.data);
        }
      });
  };
  const { handleChange, handleSubmit, errors } = useFormProduct(
    submitForm,
    product,
    setProduct,
    validateProduct
  );

  const onExitClick = () => {
    setShowFormUpdateProduct(false);
  };

  return (
    <div className="update_product-container">
      <div className="update_product-heading">
        <h3 className="update_product-heading-title">Cập nhật sản phẩm</h3>
        <div className="update_product-heading-info">
          <p>Thông tin</p>
          <div className="line-add"></div>
        </div>
        <div onClick={onExitClick} className="update_product-btn-exit">
          X
        </div>
      </div>
      <div className="update_product-body">
        <div className="update_product-form">
          <div className="update_product-form-row">
            <span>Mã sản phẩm</span>
            <input
              type="text"
              placeholder="Mã tự động"
              value={product._id}
              readOnly
            />
          </div>
          <div className="update_product-form-row">
            <span>Giá vốn (đồng)</span>
            <input
              type="text"
              pattern="[0-9]*"
              name="costPrice"
              value={product.costPrice}
              onChange={handleChange}
            />
            <p className="update_product-form-error">{errors.costPrice}</p>
          </div>
          <div className="update_product-form-row">
            <span>Loại sản phẩm</span>

            <select
              name="categoryId"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
              }}
              className="update_product-form-select"
            >
              {categories.map((category) => {
                return (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="update_product-form-row">
            <span>Giảm giá (%)</span>
            <input
              name="discount"
              type="text"
              pattern="[0-9]*"
              value={product.discount}
              onChange={handleChange}
            />

            <div className="discount_type">
              <i
                onClick={handleIncreaseDiscount}
                class="bx bxs-up-arrow discount_type_item"
              ></i>
              <i
                onClick={handleDecreaseDiscount}
                class="bx bxs-down-arrow discount_type_item"
              ></i>
            </div>
            <p className="update_product-form-error">{errors.countInStock}</p>
          </div>

          <div className="update_product-form-row">
            <span>Tên sản phẩm</span>
            <input name="name" value={product.name} onChange={handleChange} />
            <p className="update_product-form-error">{errors.name}</p>
          </div>
          <div className="update_product-form-row">
            <span>Giá bán (đồng)</span>
            <input
              type="text"
              pattern="[0-9]*"
              name="salePrice"
              className="salePrice"
              value={product.salePrice}
              onChange={handleChange}
            />
            <p className="update_product-form-error">{errors.salePrice}</p>
          </div>
          <div className="update_product-form-row">
            <span style={{ width: "30%" }}>Size</span>
            <div
              style={{ width: "70%" }}
              className="update_product-form-list-size"
            >
              {options.map((option, index) => {
                return (
                  <div className="update_product-form-size-item">
                    <input
                      onChange={() => handleOptionChecked(index)}
                      type="checkbox"
                    />
                    <span>{`${option.size}:`}</span>
                    <input
                      value={option.quantity}
                      type="text"
                      className="update_product-form-size-count"
                      onChange={(e) => {
                        let newOptions = [...options];
                        let option = { ...newOptions[index] };
                        option.quantity = Math.floor(e.target.value);
                        newOptions[index] = option;
                        setOptions(newOptions);
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <p className="update_product-form-error">{errors.size}</p>
          </div>
          <div className="update_product-form-row">
            <span>Giá nhập</span>
            <input
              pattern="[0-9]*"
              name="originPrice"
              type="text"
              value={product.originPrice}
              onChange={handleChange}
            />
            <p className="update_product-form-error">{errors.originPrice}</p>
          </div>
        </div>
      </div>
      <div className="update_product-form-images">
        <div className="update_product-form-image">
          <input
            ref={inputAvatarRef}
            type="file"
            onChange={onImageChange}
            style={{ display: "none" }}
          />
          <p>Hình ảnh sản phẩm</p>
          <img
            onClick={() => {
              inputAvatarRef.current.click();
            }}
            style={{ height: 120, width: 120 }}
            src={avatar ? URL.createObjectURL(avatar) : product.imageDisplay}
            alt=""
          />
        </div>


        {/* test mv */}
       
      </div>
      <div className="update_product-btn-row">
        <button onClick={handleSubmit} className="update_product-btn-save">
          Lưu
        </button>
        <button onClick={onExitClick} className="update_product-btn-cancel">
          Bỏ qua
        </button>
      </div>
    </div>
  );
};

export default UpdateProduct;
