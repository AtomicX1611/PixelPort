import React from "react";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import MainHeader from "./MainHeader.js";
import NavLinks from "./NavLink.js";
import SideDrawer from "./SideDrawer.js";
import "./MainNavigation.css";
import Backdrop from "../UiElements/Backdrop.js";
import ThemeToggle from "../UiElements/ThemeToggle.js";
import { ThemeContext } from "../../../context/ThemeContext.js";

const MainNavigation = (props) => {
  const [drawer, setDrawer] = useState(false);
  const { isDark, toggleTheme } = useContext(ThemeContext);

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
          <div className="main-navigation__drawer-theme">
            <span>Dark Mode</span>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">
            <span className="logo-icon">P</span>
            PixelPort
          </Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
