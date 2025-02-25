import React from "react";
import UserItem from "./UserItem";
import "./UserList.css"

const UserList = (props) => {
  if (props.users.length === 0) {
    return <div>No Users Found.</div>;
  }

  return (
    <div className="user_list">
      {props.users.map((user) => {
       return (
        <UserItem
          key={user._id}
          id={user._id}
          image={user.image}
          name={user.name || "Anonymous"}
          places={user.places.length}
        />
      )
      })}
     </div>
  );
};

export default UserList;
