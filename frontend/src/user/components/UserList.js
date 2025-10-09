import React from "react";
import "./UserList.css";
import { Link } from "react-router-dom";

const UserList = (props) => {
  const users = props.users || (props.user ? [props.user] : []);
  
  if (users.length === 0) {
    return (
      <div className="no-users-container">
        <div className="no-users-message">
          <span className="no-users-icon">👥</span>
          <p>No Users Found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-list-container">
      <div className="users-list">
        {users.map((user) => (
          <Link 
            key={user._id || user.id} 
            to={`/${user._id || user.id}/places`} 
            className="user-item"
          > 
            <div className="user-card-content">
              <div className="user-avatar">
                <img
                  src={`http://localhost:5000/${user.image}`}
                  alt={`${user.name || "User"}'s profile`}
                  className="user-image"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png'; 
                    e.target.onerror = null;
                  }}
                />
              </div>
              
              <div className="user-info">
                <h3 className="user-name">{user.name || "Unknown User"}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserList;