import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import MainHeader from "./MainHeader.js";
import NavLinks from "./NavLink.js";
import SideDrawer from "./SideDrawer.js";
import "./MainNavigation.css";
import Backdrop from "../UiElements/Backdrop.js";

const MainNavigation = (props) => {
  const [drawer, setDrawer] = useState(false);

  const openDrawer = () => {
    setDrawer(true);
  };

  const closeDrawer = () => {
    setDrawer(false);
  };

  return (
    <React.Fragment>
      {drawer && <Backdrop onClick={closeDrawer} />}
      <SideDrawer show={drawer} close={closeDrawer}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">PixelPort</Link>
        </h1>
        <nav className="nav_padding main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
