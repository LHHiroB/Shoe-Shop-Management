import React, { useEffect, useState, useRef } from "react";
import ProductsNavbar from "./products_navbar/ProductsNavbar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import "./Products.css";

import ModalUnstyled from "@mui/core/ModalUnstyled";
import { styled } from "@mui/system";
import UpdateProduct from "../products/updateProduct/UpdateProduct";
import Dialog from "../../components/dialog/Dialog";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
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

const columns = [
  { id: "_id", label: "Mã sản phẩm" },
  { id: "name", label: "Tên sản phẩm" },
  {
    id: "costPrice",
    label: "Giá vốn (vnđ)",

    format: (value) => `${value.toLocaleString("en-US")}`,
  },
  {
    id: "salePrice",
    label: "Giá bán (vnđ)",

    format: (value) => `${value.toLocaleString("en-US")}`,
  },
  {
    id: "countInStock",
    label: "Tồn kho",

    format: (value) => value.toLocaleString("en-US"),
  },
];

const Products = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  // test
  const [products, setProducts] = useState([]);
  const [originProducts, setOriginProducts] = useState([]);
  const [rerenderProducts, setRerenderProducts] = useState(false);
  const [shirts, setShirts] = useState([]);
  const [trousers, setTrousers] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [searchText, setSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [showFormUpdateProduct, setShowFormUpdateProduct] = useState(false);
  const [showDialogDelete, setShowDialogDelete] = useState(false);
  //get product from API
  useEffect(() => {
    axios
      .get("https://deloy-backend-shoeshop.onrender.com/api/products/listProduct")
      .then((res) => {
        setProducts(res.data);
        setOriginProducts(res.data);
      })
      .catch((err) => {
        console.log(err.res);
      });
  }, [showFormUpdateProduct, selectedProduct, rerenderProducts]);

  //get All products
  const getAllProducts = () => {
    axios
      .get("https://deloy-backend-shoeshop.onrender.com/api/products/listProduct")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err.res);
      });
  };
  //find product by id or by name
  const searchProduct = () => {
    if (!searchText || !products) {
      getAllProducts();
    }
    const productFilter = products.filter((product) => {
      return (
        product.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
        product._id.toLowerCase().indexOf(searchText) > -1
      );
    });
    setProducts(productFilter);
  };

  // test search theo loại danh mục

  //search product
  useEffect(() => {
    if (!searchText || !products) {
      getAllProducts();
    }
    const productFilter = originProducts.filter((product) => {
      return (
        product.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
        product._id.toLowerCase().indexOf(searchText) > -1
      );
    });
    setProducts(productFilter);
  }, [searchText]);

  //filter products by category
  const handleFilterProductsByCategory = (e) => {
    axios
      .get(
        "https://deloy-backend-shoeshop.onrender.com/api/products/productByCategory",
        {
          params: {
            category: e.target.value,
          },
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        setProducts(res.data[0].productList);
      })
      .catch((err) => {
        console.log("lỗi filter");
      });
  };
  const handleCloseDialog = () => {
    setShowDialogDelete(false);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleDeleteProduct = () => {
    axios
      .delete(
        `https://deloy-backend-shoeshop.onrender.com/api/products/deleteOnebyId/${selectedProduct._id}`
      )
      .then((res) => {
        handleCloseDialog();
        alert("Xoá sản phẩm thành công");
        setSelectedProduct(null);
      })
      .catch("Lỗi, xin hãy thử lại sau");
  };
  return (
    <div className="div_product">
      <Dialog
        title="Xoá sản phẩm"
        content={`Bạn có muốn xoá sản phẩm: ${selectedProduct?.name} `}
        open={showDialogDelete}
        handleCancel={handleCloseDialog}
        handleAction={handleDeleteProduct}
      />
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={showFormUpdateProduct}
        onClose={() => {
          setShowFormUpdateProduct(false);
        }}
        BackdropComponent={Backdrop}
      >
        <UpdateProduct
          product={selectedProduct}
          setShowFormUpdateProduct={setShowFormUpdateProduct}
          setProduct={setSelectedProduct}
        />
      </StyledModal>
      <div className="div_left">
        <div className="clothes-category-card">
          <div className="div_search">
            <div className="header_search">Tìm kiếm</div>
            <div className="search">
              <input
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                type="text"
                placeholder="Tìm theo mã, tên sản phẩm"
              />

              <i className="bx bx-search"></i>
            </div>
          </div>
        </div>

        {/* test các loại danh mục sp mv*/}
        
        <ProductsNavbar
          // test
          setRerenderProducts={setRerenderProducts}
          handlePrint={handlePrint} 
        />

      </div>
      <div className="div_right">
        <div className="col-9" style={{ padding: "10px 0px 10px 10px" }}>
          <Paper sx={{ width: "135%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table ref={componentRef} stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          backgroundColor: "#03a9f4",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                    <TableCell
                      style={{
                        backgroundColor: "#03a9f4",
                      }}
                    ></TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#03a9f4",
                      }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          key={row.code}
                          style={
                            index % 2 == 1 ? { backgroundColor: "#e8e8e8" } : {}
                          }
                        >
                          {columns.map((column) => {
                            let value = row[column.id];
                            if (column.id === "_id") {
                              value = value.substr(value.length - 7);
                            }
                            if (column.id === "countInStock") {
                              var total = 0;
                              row.options.forEach((value) => {
                                total += value.quantity;
                              });
                              value = total;
                            }
                            return (
                              <TableCell key={column.id}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                          <TableCell
                            onClick={() => {
                              console.log("update");
                              setSelectedProduct(row);
                              console.log(row);
                              setShowFormUpdateProduct(true);
                            }}
                          >
                            <i
                              style={{ fontSize: 18, color: "#0DB3E2" }}
                              class="bx bxs-edit hide-on-print"
                            ></i>
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              console.log("delete");
                              console.log(row);
                              setSelectedProduct(row);
                              setShowDialogDelete(true);
                            }}
                          >
                            <i
                              style={{ fontSize: 18, color: "#F26339" }}
                              class="bx bx-trash hide-on-print"
                            ></i>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[6, 12, 100]}
              component="div"
              count={products.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số hàng hiển thị"
            />
          </Paper>
        </div>
       
        
      </div>
    </div>
  );
};

export default Products;
