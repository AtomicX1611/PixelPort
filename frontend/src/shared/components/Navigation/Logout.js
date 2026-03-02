import React from "react";

import "./Logout.css";

const Logout = (props) => {
  return (
    <button onClick={props.onClick}>Logout</button>
  );
};

export default Logout;
