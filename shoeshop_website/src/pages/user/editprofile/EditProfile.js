import { useRef, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import "./editprofile.css";
import TextField from "@mui/material/TextField";
import DatePicker from "react-date-picker";
import axios from "axios";
export default function EditProfile({ rerender, setRerender }) {
  let location = useLocation();
  let history = useHistory();
  console.log(rerender);
  const userLocal = location.state?.user;
  const [user, setUser] = useState(userLocal);
  const [userUpdate, setUserUpdate] = useState({
    fullname: "",
    phone: "",
    address: "",
    email: "",

    birthday: user.birthday || new Date(),
  });
  const [avatar, setAvatar] = useState("");
  const handleUpdateUser = (e) => {
    setUserUpdate((prev) => {
      const name = e.target.name;
      const value = e.target.value;
      return { ...prev, [name]: value };
    });
  };
  const handleSubmitFormUpdate = (e) => {
    e.preventDefault();
    var formStaff = new FormData();

    userUpdate.fullname && formStaff.append("fullname", userUpdate.fullname);
    userUpdate.phone && formStaff.append("phone", userUpdate.phone);
    userUpdate.address && formStaff.append("address", userUpdate.address);
    userUpdate.email && formStaff.append("email", userUpdate.email);
    userUpdate.birthday && formStaff.append("birthday", userUpdate.birthday);

    avatar && formStaff.append("image", avatar);

    //post to API
    axios
      .put(
        `https://deloy-backend-shoeshop.onrender.com/api/users/updateUser/${user._id}`,
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
        setUser(res.data);
        alert("Cập nhật thông tin thành công");
        localStorage.setItem(
          "user",
          JSON.stringify({
            userId: res.data._id,
            fullname: res.data.fullname,
          })
        );
        setRerender(!rerender);
      })
      .catch((err) => {
        console.log(err.response);
        alert("Cập nhật thông tin thất bại");
      });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0]);
    }
  };
  const inputAvatarRef = useRef(null);
  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Thông tin người dùng</h1>
        <div>
          <Link
            to={{
              pathname: "./changePassWord",
              state: { user: user },
            }}
          >
            <button className="userChangePassWord">Đổi mật khẩu</button>
          </Link>

          <button
            onClick={() => {
              window.location.reload();
            }}
            className="userLogout"
          >
            Đăng xuất
          </button>
        </div>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img src={user.imageUrl} alt="" className="userShowImg" />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{user.fullname}</span>
              <span className="userShowUserTitle">{user.position}</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Tài khoản</span>
            <div className="userShowInfo">
              <span className="userShowInfoTitle">{user.username}</span>
            </div>
            <div className="userShowInfo">
              <span className="userShowInfoTitle">
                {formatDate(user.birthday)}
              </span>
            </div>
            <span className="userShowTitle">Liên hệ</span>
            <div className="userShowInfo">
              <span className="userShowInfoTitle">{user.phone}</span>
            </div>
            <div className="userShowInfo">
              <span className="userShowInfoTitle">{user.email}</span>
            </div>
            <div className="userShowInfo">
              <span className="userShowInfoTitle">{user.address}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Cập nhật</span>
          <form className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Họ tên</label>
                <input
                  type="text"
                  name="fullname"
                  value={userUpdate.fullname}
                  onChange={handleUpdateUser}
                  placeholder={user.fullname}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Số điện thoại</label>
                <input
                  name="phone"
                  type="phone"
                  value={userUpdate.phone}
                  placeholder={user.phone}
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/;

                    // if value is not blank, then test the regex

                    if (e.target.value === "" || re.test(e.target.value)) {
                      setUserUpdate((prev) => {
                        return { ...prev, phone: e.target.value };
                      });
                    }
                  }}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder={user.email}
                  className="userUpdateInput"
                  value={userUpdate.email}
                  onChange={handleUpdateUser}
                />
              </div>
              
              <div className="userUpdateItem">
                <label style={{ padding: 0 }}>Ngày sinh</label>
                <div className="user-date-picker">
                  {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
                    <DatePicker
                      format="dd/MM/yyyy"
                      // value={formatDate(userUpdate.birthday)}
                      value={userUpdate.birthday}
                      inputFormat="dd/MM/yyyy"
                      onChange={(value) => {
                        setUserUpdate((prev) => {
                          return { ...prev, birthday: value };
                        });
                      }}
                      views={["day", "month", "year"]}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      renderInput={(params) => (
                        <TextField
                          InputLabelProps={{
                            shrink: false,
                          }}
                          {...params}
                          variant="standard"
                          size="small"
                        />
                      )}
                    />
                  {/* </LocalizationProvider> */}
                </div>
              </div>
              <div className="userUpdateItem">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  placeholder={user.address || ""}
                  name="address"
                  value={userUpdate.address}
                  className="userUpdateInput"
                  onChange={handleUpdateUser}
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img
                  onClick={() => {
                    inputAvatarRef.current.click();
                  }}
                  className="userUpdateImg"
                  src={avatar ? URL.createObjectURL(avatar) : user.imageUrl}
                  alt=""
                />

                <label htmlFor="file"></label>
                <input
                  onChange={onImageChange}
                  accept="image/png, image/gif, image/jpeg"
                  ref={inputAvatarRef}
                  type="file"
                  style={{ display: "none" }}
                />
              </div>
              <button
                onClick={handleSubmitFormUpdate}
                className="userUpdateButton"
              >
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
