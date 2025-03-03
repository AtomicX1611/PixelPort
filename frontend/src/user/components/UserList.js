import React from "react";

import "./UserList.css"
import { Link } from "react-router-dom";

const UserList = (props) => {
  if (props.users.length === 0) {
    return <div>No Users Found.</div>;
  }

  return (
    <div className="container">
    <div className="scrollContainer">
      <div className="userList">
        {props.users.map((user) => (
         <Link to={`/${user._id}/places`} className="userLink">
         <div key={user.id} className="userItem">
            <div className="avatarContainer">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={`${user.name}'s avatar`} 
                  className="avatarImage" 
                />
              ) : (
                <div className="avatarFallback">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="userName">
              {user.name}
            </span>
          </div>
         </Link>
        ))}
      </div>
    </div>
  </div>
  
  );
};

export default UserList;
