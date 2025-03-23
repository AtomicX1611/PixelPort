import React from "react";

import "./UserList.css";
import { Link } from "react-router-dom";

const UserList = (props) => {
  if (props.users.length === 0) {
    return <div>No Users Found.</div>;
  }

  return (
    <div className="users-list-container">
      <div className="users-list">
        {props.users.map((user) => (
          <Link key={user._id} to={`/${user._id}/places`} className="user-item">
            <div className="user-avatar">
              <img
                src={`http://localhost:5000/${user.image}`}
                alt={`${user.name || "User"}'s profile`}
                className="user-image"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserList;
