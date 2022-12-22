import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "../../components/dialog/Dialog";
import axios from "axios";
import "./staff.css";

import ModalUnstyled from "@mui/core/ModalUnstyled";
import AddStaff from "./AddStaff";
import UpdateStaff from "./UpdateStaff";
import { styled, Box } from "@mui/system";

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
  { id: "_id", label: "Mã nhân viên" },
  { id: "fullname", label: "Tên nhân viên" },
  {
    id: "position",
    label: "Chức vụ",

    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "phone",
    label: "Số điện thoại",

    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "gender",
    label: "Giới tính",
  },
];

const Staff = (props) => {
  const [staffs, setStaffs] = useState([]);
  const [originStaffs, setOriginStaff] = useState([]);
  const [position, setPosition] = useState();
  const [selectedStaff, setSelectedStaff] = useState();
  const [showFormAddStaff, setShowFormAddStaff] = useState(false);
  const [showFormUpdateStaff, setShowFormUpdateStaff] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [textSearch, setTextSearch] = useState("");

  const [showDialogDelete, setShowDialogDelete] = useState(false);
  useEffect(() => {
    axios
      .get("https://deloy-backend-shoeshop.onrender.com/api/users")
      .then((res) => {
        setStaffs(res.data);
        setOriginStaff(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [showFormAddStaff, showFormUpdateStaff, selectedStaff]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(() => {
    if (!textSearch) {
      getAllStaff();
    }
    const staffFilter = originStaffs.filter((staff) => {
      //Name: Ho Quang Linh
      // textSearch: Quang

      return (
        staff.fullname.toLowerCase().indexOf(textSearch.toLowerCase()) > -1 ||
        staff._id.toLowerCase().indexOf(textSearch.toLowerCase()) > -1 ||
        staff.phone.indexOf(textSearch) > -1
      );
    });

    setStaffs(staffFilter);
  }, [textSearch, originStaffs]);
  const getAllStaff = () => {
    axios
      .get("https://deloy-backend-shoeshop.onrender.com/api/users")
      .then((res) => {
        setStaffs(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //filter staffs by position
  useEffect(() => {
    axios
      .get("https://deloy-backend-shoeshop.onrender.com/api/users/getUserByPosition", {
        params: {
          position: position,
        },
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        setStaffs(res.data);
      })
      .catch((err) => {
        alert("lỗi");
      });
  }, [position]);

  const handleCloseDialog = () => {
    setShowDialogDelete(false);
  };
  const handleDeleteStaff = () => {
    axios
      .delete(
        `https://deloy-backend-shoeshop.onrender.com/api/users/deleteOnebyId/${selectedStaff._id}`
      )
      .then((res) => {
        handleCloseDialog();
        alert("Xoá nhân thành công");
        setSelectedStaff(null);
      })
      .catch(() => {
        alert("Lỗi xin bạn hãy thử lại sau");
        handleCloseDialog();
      });
  };
  return (
    <div className="div_staff">
      <Dialog
        title="Xoá nhân viên"
        content={`Bạn có muốn xoá nhân viên: ${selectedStaff?.fullname} `}
        open={showDialogDelete}
        handleCancel={handleCloseDialog}
        handleAction={handleDeleteStaff}
      />
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={showFormAddStaff}
        onClose={() => {
          setShowFormAddStaff(false);
        }}
        BackdropComponent={Backdrop}
      >
        <AddStaff setShowFormAddStaff={setShowFormAddStaff} />
      </StyledModal>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={showFormUpdateStaff}
        onClose={() => {
          setShowFormUpdateStaff(false);
        }}
        BackdropComponent={Backdrop}
      >
        <UpdateStaff
          staff={selectedStaff}
          setStaff={setSelectedStaff}
          setShowFormUpdateStaff={setShowFormUpdateStaff}
        />
      </StyledModal>

      <div className="div_left">
        <div className="div_search">
          <div className="header_search">Tìm kiếm</div>
          <div className="search">
            <input
              value={textSearch}
              onChange={(e) => {
                setTextSearch(e.target.value);
              }}
              type="text"
              placeholder="Tìm theo mã, tên nhân viên"
            />
            <i className="bx bx-search"></i>
          </div>
        </div>
        <div className="div_search">
          <div className="header_search">Chức vụ</div>
          <select
            onChange={(e) => {
              setPosition(e.target.value);
            }}
            className="selectbox"
            value={position}
          >
            <option value="all">Tất cả</option>
            <option value="Nhân viên kho">Nhân viên kho</option>
            <option value="Nhân viên thu ngân">Nhân viên thu ngân</option>
          </select>
        </div>
        <div className="action-staff-btn">
          <button onClick={() => setShowFormAddStaff(true)}>
            <i class="bx bx-plus"></i>
            Thêm nhân viên{" "}
          </button>
        </div>
      </div>
      <div className="div_right">
        <div className="col-9" style={{ padding: "10px 0px 10px 10px" }}>
          <Paper sx={{ width: "135%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
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
                  {staffs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(
                      (row, index) =>
                        row.position !== "Chủ cửa hàng" && (
                          <TableRow
                            hover
                            role="checkbox"
                            key={row.code}
                            style={
                              index % 2 == 1
                                ? { backgroundColor: "#e8e8e8" }
                                : {}
                            }
                          >
                            {columns.map((column) => {
                              let value = row[column.id];
                              if (column.id === "_id") {
                                value = value.substr(value.length - 7);
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
                                setSelectedStaff(row);
                                console.log(row);
                                setShowFormUpdateStaff(true);
                              }}
                              padding="checkbox"
                            >
                              <i
                                style={{ fontSize: 18, color: "#0DB3E2" }}
                                class="bx bxs-edit"
                              ></i>
                            </TableCell>
                            <TableCell
                              onClick={() => {
                                console.log("delete");
                                console.log(row);
                                setSelectedStaff(row);
                                setShowDialogDelete(true);
                              }}
                              padding="checkbox"
                            >
                              <i
                                style={{ fontSize: 18, color: "#F26339" }}
                                class="bx bx-trash"
                              ></i>
                            </TableCell>
                          </TableRow>
                        )
                    )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[6, 12, 100]}
              component="div"
              count={staffs.length}
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

export default Staff;