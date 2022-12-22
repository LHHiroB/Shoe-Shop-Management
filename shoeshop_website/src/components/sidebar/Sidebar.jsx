import React, { useState, useEffect } from "react";

import "./sidebar.css";
import sidebar from "../../assets/data/sidebar.json";
import SidebarItem from "./SidebarItem";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo1.png";
import axios from "axios";
const Sidebar = ({ currentTabIndex, setCurrentTabIndex }) => {
  const userLocal = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState([]);
  const getPermission = (user) => {
    if (user.position === "Chủ cửa hàng") {
      return 0;
    }
    if (user.position === "Nhân viên thu ngân") {
      return 1;
    }
    if (user.position === "Nhân viên kho") {
      return 2;
    }
  };
    useEffect(() => {
            console.log(console.log("test hue"));

            axios
                .get(
                    `https://deloy-backend-shoeshop.onrender.com/api/users/getInfo/${userLocal.userId}`
                )
                .then((res) => {
                    setUser(res.data);
                });    
        }, []
    );
  return (
    <div className="sidebar">
      <img style={{ width: "150px", height: "150px", marginLeft: "50px" }} src={logo} alt="" />

      {sidebar.map((item, index) => {
        if (item.permissionUser.includes(getPermission(user)))
          return (
            <Link
              to={{
                pathname: item.route,
                state: { user },
              }}
            >
              <SidebarItem
                onClick={() => {
                  setCurrentTabIndex(index);
                }}
                active={index === currentTabIndex}
                icon={item.icon}
                title={item.display_name}
              ></SidebarItem>
            </Link>
          );
      })}
    </div>
  );
};

export default Sidebar;