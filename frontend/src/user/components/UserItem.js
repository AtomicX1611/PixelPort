import React from "react";
import "./UserItem.css";
import { Link } from "react-router-dom";

const UserItem = (user) => {
  return (
    <div className="card">
      <div className="card_content">
        <Link to={`/${user._id}/places`}>
          <h3>{user.name}</h3>
          <h3>Places : {user.places}</h3>
        </Link>
      </div>
    </div>
  );
};

export default UserItem;
