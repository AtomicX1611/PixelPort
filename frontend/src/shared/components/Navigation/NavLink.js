import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Logout from "./Logout";

import "./NavLinks.css";

const NavLinks = () => {
  const auth = useContext(AuthContext);
  
  const logoutHandler = () => {
      auth.logout();
  }

  return (
    <ul className="nav-links">
      <li>
        <Link to="/" exact>
          All Users
        </Link>
      </li>
      {auth.isLoggedIn && (
        <li>
          <Link to="/u1/places">My Places</Link>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <Link to="/places/new">Add Place</Link>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <Logout onClick={logoutHandler}/>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <Link to="/auth">Auth</Link>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
