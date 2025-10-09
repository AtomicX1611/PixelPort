import React, { useEffect, useState } from "react";
import UserList from "../components/UserList";
import "../components/UserList.css";
import usehttpClient from "../../shared/hooks/http-hook.js";
import ImageGallery from "../../places/components/ImageGallery";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { loading, error, sendRequest, clearError } = usehttpClient();

  const fetchUsers = async (pageNumber) => {
    try {
      const response = await sendRequest(
        `http://localhost:5000/api/users?page=${pageNumber}&limit=6`
      );
      const newUsers = response.message || [];
      if (pageNumber === 1) {
        setUsers(newUsers);
      } else {
        setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      }
      setHasMore(newUsers.length === 6);
      setIsInitialLoad(false);
    } catch (err) {
      console.log("Error Occurred : ", err);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page, sendRequest]);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const LoadingSkeleton = () => (
    <div className="user-card skeleton">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-info">
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button className="retry-button" onClick={() => { clearError(); fetchUsers(1); }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to PixelPort</h1>
        <p className="hero-subtitle">Connect with creative minds and explore amazing places</p>
      </div>

      <section className="users-section">
        <h2 className="section-title">Our Community</h2>
        <div className="users-grid" onScroll={handleScroll}>
          {users.map((user) => (
            <div key={user.id} className="user-card-wrapper">
              <UserList user={user} />
            </div>
          ))}
          {loading && Array(3).fill(null).map((_, index) => (
            <LoadingSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      </section>

      <ImageGallery />

      {!loading && users.length === 0 && !isInitialLoad && (
        <div className="empty-state">
          <h3>No Users Found</h3>
          <p>Be the first to join our community!</p>
        </div>
      )}
    </div>
  );
};

export default Users;