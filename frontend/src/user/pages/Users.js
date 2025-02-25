import React, { useEffect, useState } from "react";
import UserList from "../components/UserList";
import "../components/UserList.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Fetching Data")
        const responseData = await response.json();
        setUsers(responseData.message || []);
      } catch (err) {
        console.log("Error Occured : ", err);
        setError(err.message)
      }finally{
        console.log("Finished Fetching")
        setLoading(false)
      }
    };
    fetchUsers();
  }, []);



 

  if(error){
    return <div>
      Error : {error}
    </div>
  }

  if(users.length === 0 || !users){
    return <div>
      No Users Found.
    </div>
  }

  return (
    <div className="slider_container">
       <UserList users={users}/>
    </div>
  );
};

export default Users;
