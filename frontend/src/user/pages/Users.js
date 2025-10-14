import { useEffect, useState, useRef, useContext } from "react";
import UserList from "../components/UserList";
import "../components/UserList.css";
import usehttpClient from "../../shared/hooks/http-hook.js";
import ImageGallery from "../../places/components/ImageGallery";
import { AuthContext } from "../../context/AuthContext.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./Users.modern.css";

gsap.registerPlugin(ScrollTrigger);

const Users = () => {
  const auth = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { loading, error, sendRequest, clearError } = usehttpClient();
  const [heroRef1, inViewHero] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const fetchUsers = async (pageNumber) => {
    try {
      setIsInitialLoad(true);
      const response = await sendRequest(
        `http://localhost:5000/api/users?page=${pageNumber}&limit=16${searchTerm ? `&search=${searchTerm}` : ''}${activeFilter !== 'all' ? `&filter=${activeFilter}` : ''}`
      );
      const newUsers = response.message || [];
      
      // Filter out current user only if authenticated
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
      console.log("Error Occurred : ", err);
      setIsInitialLoad(false);
    }
  };

  // Handle search and filter changes
  useEffect(() => {
    setPage(1);
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [searchTerm, activeFilter, auth.isLoggedIn]);

  // Handle pagination
  useEffect(() => {
    if (page > 1) {
      fetchUsers(page);
    }
  }, [page]);

  // Initial fetch and refetch when auth state changes
  useEffect(() => {
    fetchUsers(1);
  }, [auth.isLoggedIn]);

  // Monitor auth context changes
  useEffect(() => {
    console.log('Auth context updated:', {
      isLoggedIn: auth.isLoggedIn,
      userId: auth.userId,
      token: auth.token ? 'present' : 'absent'
    });
  }, [auth]);

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
      <motion.div 
        className="hero-section"
        ref={heroRef1}
        initial={{ opacity: 0, y: 50 }}
        animate={inViewHero ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="hero-content">
          <motion.h1 
            className="hero-title text-gradient"
            initial={{ opacity: 0, y: 30 }}
            animate={inViewHero ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Welcome to PixelPort
          </motion.h1>
          <motion.p 
            className="hero-subtitle text-light"
            initial={{ opacity: 0, y: 20 }}
            animate={inViewHero ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Connect with creative minds and explore amazing places
          </motion.p>
          <motion.div 
            className="search-container"
            initial={{ opacity: 0, y: 20 }}
            animate={inViewHero ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="filter-buttons">
              <button
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${activeFilter === 'popular' ? 'active' : ''}`}
                onClick={() => setActiveFilter('popular')}
              >
                Popular
              </button>
              <button
                className={`filter-btn ${activeFilter === 'new' ? 'active' : ''}`}
                onClick={() => setActiveFilter('new')}
              >
                New
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <section className="users-section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Community
        </motion.h2>
        <div className="users-grid-container">
          <div className="users-grid" onScroll={handleScroll}>
            {users.map((user, index) => (
              <motion.div 
                key={user._id} 
                className="user-card-wrapper"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
              >
                <UserList user={user} />
              </motion.div>
            ))}
            {loading && Array(3).fill(null).map((_, index) => (
              <LoadingSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
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