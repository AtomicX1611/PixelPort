import React from "react";
import "./UserList.css";
import { Link } from "react-router-dom";

const UserList = (props) => {
  const users = props.users || (props.user ? [props.user] : []);
  
  if (users.length === 0) {
    return null;
  }

  return (
    <>
      {users.map((user) => (
        <Link 
          key={user._id || user.id} 
          to={`/${user._id || user.id}/places`} 
          className="user-card"
        > 
          <div className="user-card__avatar">
            <img
              src={`http://localhost:5000/${user.image}`}
              alt={`${user.name || "User"}'s profile`}
              onError={(e) => {
                e.target.src = '/default-avatar.png'; 
                e.target.onerror = null;
              }}
            />
          </div>
          <div className="user-card__info">
            <h3 className="user-card__name">{user.name || "Unknown User"}</h3>
            <span className="user-card__places">
              {user.places?.length || 0} {user.places?.length === 1 ? 'place' : 'places'}
            </span>
          </div>
          <svg className="user-card__arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ))}
    </>
  );
};

export default UserList;