import React, { useEffect, useState } from "react";
import "./navbar.css";
// import cr7 from "../../assets/images/cr7.jpg";
import { Link } from "react-router-dom";
import axios from "axios";

const NavBar = ({ rerender, currentTabIndex, setCurrentTabIndex }) => {
  console.log(JSON.parse(localStorage.getItem("user")));
  const userLocal = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState([]);
  console.log(userLocal.userId);
  useEffect(() => {
    console.log(console.log("test"));

    axios
      .get(
        `https://deloy-backend-shoeshop.onrender.com/api/users/getInfo/${userLocal.userId}`
      )
      .then((res) => {
        setUser(res.data);
      });
  }, [rerender]);
  return (
    <div>
      <div className="navbar">
        <div className="navbar__left">
          <i className="bx bx-menu"></i>
          <p></p>
        </div>

        <div
          onClick={() => {
            setCurrentTabIndex(8);
          }}
          className="navbar__right"
        >
          <Link
            to={{
              pathname: "/editProfile",
              state: { user },
            }}
          >
            <div className="navbar__right-item">
              <img src={user?.imageUrl} alt="" />
              <span>{user.fullname}</span>
              {/* <img src="https://i.pinimg.com/280x280_RS/2e/45/66/2e4566fd829bcf9eb11ccdb5f252b02f.jpg" alt="" />
              <span>Hue Nguyen</span> */}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;