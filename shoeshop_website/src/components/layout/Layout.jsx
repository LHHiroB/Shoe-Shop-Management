import React, { useState } from "react";
import NavBar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import "./layout.css";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesLayout from "../../navigation/RoutesLayout";
const Layout = () => {
  const [rerender, setRerender] = useState(false);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  return (
    <Router>
      <Sidebar
        currentTabIndex={currentTabIndex}
        setCurrentTabIndex={setCurrentTabIndex}
      />
      <div className="layout__content">
        <NavBar
          currentTabIndex={currentTabIndex}
          setCurrentTabIndex={setCurrentTabIndex}
          rerender={rerender}
        />
        <div className="layout__content-routes">
          <RoutesLayout rerender={rerender} setRerender={setRerender} />
        </div>
      </div>
    </Router>
  );
};

export default Layout;