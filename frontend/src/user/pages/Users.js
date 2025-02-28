import React, { useEffect, useState } from "react";
import UserList from "../components/UserList";
import "../components/UserList.css";
import usehttpClient from "../../shared/hooks/http-hook.js";

const Users = () => {
  const [users, setUsers] = useState([]);

  const { loading, error, sendRequest, clearError } = usehttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Calling sendReq")
        const response = await sendRequest("http://localhost:5000/api/users");
        console.log("Got reply from sendReq")
        const responseData = response;
        setUsers(responseData.message || []);
      } catch (err) {
        console.log("Error Occured : ", err);
      } finally {
        console.log("Finished Fetching");
      }
    };
    fetchUsers(); 
  }, [sendRequest]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error : {error}</div>;
  }

  if (users.length === 0 || !users) {
    return <div>No Users Found.</div>;
  }

  return (
    <div className="slider_container">
      <UserList users={users} />
    </div>
  );
};

export default Users;
