import { Switch, Route } from "react-router-dom";
import React, { useState } from "react";
import Dashboard from "../pages/dashboard/Dashboard";
import Staff from "../pages/staff/Staff";
import Customers from "../pages/customers/Customers";
import Sales from "../pages/sales/Sales";
import Products from "../pages/products/Products";
import Orders from "../pages/orders/Orders";
import Revenues from "../pages/revenues/Revenues";
import Checkout from "../pages/sales/checkout/Checkout";
import EditProfile from "../pages/user/editprofile/EditProfile";
import ChangePassWord from "../pages/user/changepassword/ChangePassWord";
import OrderDetail from "../pages/orders/orderdetail/OrderDetail";
const RoutesLayout = ({ rerender, setRerender }) => {
  const user = localStorage.getItem("user");
  console.log(user);
  return (
    <Switch>
      <Route path="/customers">
        <Customers></Customers>
      </Route>
      <Route path="/sales">
        <Sales />
      </Route>
      <Route path="/checkout">
        <Checkout />
      </Route>
      <Route path="/products">
        <Products />
      </Route>
    
      <Route path="/orders">
        <Orders />
      </Route>
      <Route path="/orderDetail">
        <OrderDetail />
      </Route>
      <Route path="/staffs">
        <Staff />
      </Route>
      <Route path="/editProfile">
        <EditProfile rerender={rerender} setRerender={setRerender} />
      </Route>
      <Route path="/revenues">
        <Revenues />
      </Route>
      <Route path="/changePassWord">
        <ChangePassWord />
      </Route>
      <Route path="/">
        <Dashboard></Dashboard>
      </Route>
    </Switch>
  );
};

export default RoutesLayout;
