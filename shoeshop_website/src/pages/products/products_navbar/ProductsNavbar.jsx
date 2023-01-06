import React, { useState, useRef } from "react";
import "./products_navbar.css";
import AddProduct from "./../AddProduct";
import ModalUnstyled from "@mui/core/ModalUnstyled";
import Dialog from "../../../components/dialog/Dialog";
import { styled } from "@mui/system";
import axios from "axios";
import { Link } from "react-router-dom";
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
const ProductsNavbar = ({ setRerenderProducts , handlePrint}) => {
  const [showFormAddProduct, setShowFormAddProduct] = useState(false);
  const excelRef = useRef(null);
  const [showExcelIcon, setShowExcelIcon] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [showDialogImport, setShowDialogImport] = useState(false);
  const handleClose = () => {
    setShowFormAddProduct(false);
  };
  const handleSelectFile = (e) => {
    e.stopPropagation();

    if (e.target.files) {
      setShowExcelIcon(true);
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleShowModal = () => {
    if (!showExcelIcon) {
      alert("Vui lòng chọn file ở icon bên trái trước");
    } else {
      setShowDialogImport(true);
    }
  };
  const handleImportFile = (e) => {
    const excelFileProducts = new FormData();
    excelFileProducts.append("file", selectedFile);
    axios
      .post(
        "https://deloy-backend-shoeshop.onrender.com/api/products/import",
        excelFileProducts,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        alert("Thêm danh sách sản phẩm thành công");
        setRerenderProducts(true);
        setShowDialogImport(false);
        setShowExcelIcon(false);
      })
      .catch((err) => {
        alert("Lỗi nhập hàng, vui lòng kiểm tra lại file excel");
        setShowDialogImport(false);
        setShowExcelIcon(false);
      });
  };
  return (
    <div>
      <div>
        <StyledModal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={showFormAddProduct}
          onClose={handleClose}
          BackdropComponent={Backdrop}
        >
          <AddProduct
            setRerenderProducts={setRerenderProducts}
            setShowFormAddProduct={setShowFormAddProduct}
          />
        </StyledModal>
      </div>

      <div className="row list-action-products-btn">
        <div
          onClick={() => setShowFormAddProduct(true)}
          className="action-products-btn"
        >
          <i class="bx bx-plus"></i>
          Thêm mới {" "}
        </div>
        <div
          onClick={() => {
            handlePrint();
          }}
          className="action-products-btn"
        >
          <i class="bx bxs-file-export"></i>Xuất file
        </div>
      </div>
    </div>
  );
};

export default ProductsNavbar;
