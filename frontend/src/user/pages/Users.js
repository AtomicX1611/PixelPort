import { useEffect, useState, useContext } from "react";
import UserList from "../components/UserList";
import "../components/UserList.css";
import usehttpClient from "../../shared/hooks/http-hook.js";
import { AuthContext } from "../../context/AuthContext.js";
import "./Users.modern.css";

const Users = () => {
  const auth = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { loading, error, sendRequest, clearError } = usehttpClient();

  const fetchUsers = async (pageNumber) => {
    try {
      setIsInitialLoad(true);
      const response = await sendRequest(
        `http://localhost:5000/api/users?page=${pageNumber}&limit=16${searchTerm ? `&search=${searchTerm}` : ''}${activeFilter !== 'all' ? `&filter=${activeFilter}` : ''}`
      );
      const newUsers = response.message || [];
      
      const processedUsers = auth.isLoggedIn && auth.userId
        ? newUsers.filter(user => user._id !== auth.userId)
        : newUsers;
      
      if (pageNumber === 1) {
        setUsers(processedUsers);
      } else {
        setUsers((prevUsers) => [...prevUsers, ...processedUsers]);
      }
      setHasMore(newUsers.length === 16);
      setIsInitialLoad(false);
    } catch (err) {
      console.error(err);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    setPage(1);
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, activeFilter, auth.isLoggedIn]);

  useEffect(() => {
    if (page > 1) {
      fetchUsers(page);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers(1);
  }, [auth.isLoggedIn]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const SkeletonCard = () => (
    <div className="skeleton-card">
      <div className="skeleton-avatar-lg" />
      <div className="skeleton-lines">
        <div className="skeleton-line" />
        <div className="skeleton-line short" />
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="error-page">
        <div className="error-page__content">
          <div className="error-page__icon">!</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => { clearError(); fetchUsers(1); }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__badge">Discover & Share Places</div>
          <h1 className="hero__title">
            Find amazing places<br />shared by real people
          </h1>
          <p className="hero__subtitle">
            Join a community of travelers and explorers sharing their favorite spots around the world.
          </p>
          {!auth.isLoggedIn && (
            <div className="hero__actions">
              <a href="/auth" className="btn-primary btn-lg">Get Started</a>
              <a href="#community" className="btn-secondary btn-lg">Browse Community</a>
            </div>
          )}
        </div>
      </section>

      {/* Search & Filters */}
      <section className="search-section" id="community">
        <div className="search-section__inner">
          <div className="search-bar">
            <svg className="search-bar__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar__input"
            />
          </div>
          <div className="filter-chips">
            {['all', 'popular', 'new'].map((filter) => (
              <button
                key={filter}
                className={`chip ${activeFilter === filter ? 'chip--active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Users Grid */}
      <section className="community-section">
        <div className="community-section__inner">
          <div className="section-header">
            <h2>Community Members</h2>
            <span className="member-count">{users.length} members</span>
          </div>
          <div className="users-grid">
            {isInitialLoad && users.length === 0
              ? Array(8).fill(null).map((_, i) => <SkeletonCard key={i} />)
              : users.map((user) => (
                  <UserList key={user._id} user={user} />
                ))
            }
            {loading && !isInitialLoad && Array(4).fill(null).map((_, i) => (
              <SkeletonCard key={`loading-${i}`} />
            ))}
          </div>
          {hasMore && !loading && users.length > 0 && (
            <div className="load-more-container">
              <button className="btn-secondary" onClick={handleLoadMore}>
                Load More
              </button>
            </div>
          )}
          {!loading && users.length === 0 && !isInitialLoad && (
            <div className="empty-state">
              <div className="empty-state__icon">🌍</div>
              <h3>No one here yet</h3>
              <p>Be the first to join the community!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Users;