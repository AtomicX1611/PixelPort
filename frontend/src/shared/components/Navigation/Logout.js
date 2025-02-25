import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

import "./Logout.css";
import Button from "../UiElements/Button";

const Logout = (props) => {
  return (
    <button onClick={props.onClick}>Logout</button>
  );
};

export default Logout;
