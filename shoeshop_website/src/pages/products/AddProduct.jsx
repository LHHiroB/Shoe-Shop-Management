import React, { useState, useRef, useEffect } from "react";
// import "../staff/addstaff/AddStaff.css";
import "../staff/AddStaff.css";
import "./AddProduct.css";
import axios from "axios";

import validateProduct from "./form_validate/validateProduct";
import useFormProduct from "./form_validate/useFormProduct";

const AddProduct = ({ setRerenderProducts, setShowFormAddProduct }) => {
  const inputAvatarRef = useRef(null);
  const [productId, setProductId] = useState();
  const [avatar, setAvatar] = useState();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState();
 
  const [product, setProduct] = useState({
    name: "",
    category: "Áo",
    costPrice: 0,
    salePrice: 0,
    originPrice: 0,
    discount: 0,
  });

  //get All categories
  useEffect(() => {
    axios
      .get("https://deloy-backend-shoeshop.onrender.com/api/products/getAllCategories")
      .then((res) => {
        console.log(res.data);
        setCategories(res.data);
        setCategoryId(res.data[0]._id);
      });
  }, []);

  const [options, setOptions] = useState([
    { id: 0, size: "37", quantity: 0 },
    { id: 1, size: "38", quantity: 0 },
    { id: 2, size: "39", quantity: 0 },
    { id: 3, size: "40", quantity: 0 },
    { id: 4, size: "41", quantity: 0 },
    { id: 5, size: "42", quantity: 0 },
   

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
      .post(
        "https://deloy-backend-shoeshop.onrender.com/api/products/add",
        formProduct,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setProductId(res.data._id);
        setRerenderProducts(true);
        alert("Thêm sản phẩm thành công");
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          alert("Thêm sản phẩm thất bại");
          // Request made and server responded
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
    setShowFormAddProduct(false);
  };

  return (
    <div className="add_product-container">
      <div className="add_product-heading">
        <h3 className="add_product-heading-title">Thêm mới sản phẩm</h3>
        <div className="add_product-heading-info">
          <p>Thông tin</p>
          <div className="line-add"></div>
        </div>
        <div onClick={onExitClick} className="add_product-btn-exit">
          X
        </div>
      </div>
      <div className="add_product-body">
        <div className="add_product-form">
          <div className="add_product-form-row">
            <span>Mã sản phẩm</span>
            <input
              value={productId}
              type="text"
              placeholder="Mã tự động"
              readOnly
            />
          </div>
          <div className="add_product-form-row">
            <span>Giá vốn (đồng)</span>
            <input
              type="text"
              pattern="[0-9]*"
              name="costPrice"
              value={product.costPrice}
              onChange={handleChange}
            />
            <p className="add_product-form-error">{errors.costPrice}</p>
          </div>
          <div className="add_product-form-row">
            <span>Loại sản phẩm</span>

            <select
              name="category"
              onChange={(e) => {
                setCategoryId(e.target.value);
              }}
              className="add_product-form-select"
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
          <div className="add_product-form-row">
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
            <p className="add_product-form-error">{errors.countInStock}</p>
          </div>

          <div className="add_product-form-row">
            <span>Tên sản phẩm</span>
            <input name="name" value={product.name} onChange={handleChange} />
            <p className="add_product-form-error">{errors.name}</p>
          </div>
          <div className="add_product-form-row">
            <span>Giá bán (đồng)</span>
            <input
              type="text"
              pattern="[0-9]*"
              name="salePrice"
              className="salePrice"
              value={product.salePrice}
              onChange={handleChange}
            />
            <p className="add_product-form-error">{errors.salePrice}</p>
          </div>
          <div className="add_product-form-row">
            <span style={{ width: "30%" }}>Size</span>
            <div
              style={{ width: "70%" }}
              className="add_product-form-list-size"
            >
              {options.map((option, index) => {
                return (
                  <div className="add_product-form-size-item">
                    <input
                      onChange={() => handleOptionChecked(index)}
                      type="checkbox"
                    />
                    <span>{`${option.size}:`}</span>
                    <input
                      value={option.quantity}
                      type="text"
                      className="add_product-form-size-count"
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
            <p className="add_product-form-error">{errors.size}</p>
          </div>
          <div className="add_product-form-row">
            <span>Giá nhập hàng</span>
            <input
              pattern="[0-9]*"
              name="originPrice"
              type="text"
              value={product.originPrice}
              onChange={handleChange}
            />
            <p className="add_product-form-error">{errors.originPrice}</p>
          </div>
        </div>
      </div>
      <div className="add_product-form-images">
        <div className="add_product-form-image">
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
            style={{ height: 120, width: 120, cursor: "pointer" }}
            src={
              avatar
                ? URL.createObjectURL(avatar)
                : "https://res.cloudinary.com/hoquanglinh/image/upload/v1639458680/Linh/cwq6qhmybgzhvpp58ytp.png"
            }
            alt=""
          />
        </div>
        
      </div>
      <div className="add_product-btn-row">
        <button onClick={handleSubmit} className="add_product-btn-save">
          Lưu
        </button>
        <button onClick={onExitClick} className="add_product-btn-cancel">
          Bỏ qua
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
