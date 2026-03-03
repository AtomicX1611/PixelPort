import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import useHttpClient from "../../shared/hooks/http-hook.js";
import LoadingSpinner from "../../shared/components/UiElements/LoadingSpinner.js";
import ErrorModal from "../../shared/components/UiElements/ErrorModal.js";
import "./Explore.css";

const Explore = () => {
  const { loading, error, sendRequest, clearError } = useHttpClient();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPosts, setTotalPosts] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const observer = useRef();
  const searchInputRef = useRef();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset when search changes
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearch]);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      const searchParam = debouncedSearch
        ? `&search=${encodeURIComponent(debouncedSearch)}`
        : "";
      const responseData = await sendRequest(
        `http://localhost:5000/api/places/images?page=${page}&limit=12${searchParam}`
      );
      setPosts((prev) => {
        if (page === 1) return responseData.posts;
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = responseData.posts.filter(
          (p) => !existingIds.has(p.id)
        );
        return [...prev, ...newPosts];
      });
      setHasMore(responseData.hasMore);
      setTotalPosts(responseData.totalPosts);
      setInitialLoad(false);
    } catch (err) {
      setInitialLoad(false);
    }
  }, [sendRequest, page, debouncedSearch]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Infinite scroll with Intersection Observer
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const clearSearch = () => {
    setSearch("");
    searchInputRef.current?.focus();
  };

  return (
    <div className="explore-page">
      {/* Hero / Search Section */}
      <div className="explore-hero">
        <div className="explore-hero__inner">
          <h1 className="explore-hero__title">Explore Places</h1>
          <p className="explore-hero__subtitle">
            Discover amazing places shared by our community
          </p>
          <div className="explore-search">
            <div className="explore-search__input-wrapper">
              <svg
                className="explore-search__icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="20"
                height="20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by place name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="explore-search__input"
              />
              {search && (
                <button className="explore-search__clear" onClick={clearSearch}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    width="18"
                    height="18"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {!initialLoad && (
            <p className="explore-hero__count">
              {totalPosts} {totalPosts === 1 ? "post" : "posts"} found
              {debouncedSearch && (
                <span>
                  {" "}
                  for "<strong>{debouncedSearch}</strong>"
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <ErrorModal error={error} onClear={clearError} />

      {/* Posts Grid */}
      <div className="explore-content">
        {initialLoad && loading ? (
          <div className="explore-loading">
            <LoadingSpinner />
          </div>
        ) : posts.length === 0 && !loading ? (
          <div className="explore-empty">
            <div className="explore-empty__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="48"
                height="48"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3>No posts found</h3>
            <p>
              {debouncedSearch
                ? "Try a different search term"
                : "Be the first to share a place!"}
            </p>
          </div>
        ) : (
          <div className="explore-grid">
            {posts.map((post, index) => {
              const isLast = index === posts.length - 1;
              return (
                <Link
                  to={`/post/${post.id}`}
                  className="explore-card"
                  key={post.id}
                  ref={isLast ? lastPostRef : null}
                >
                  <div className="explore-card__image">
                    <img
                      src={`http://localhost:5000/${post.thumbnail}`}
                      alt={post.title}
                      loading="lazy"
                    />
                    {post.imageCount > 1 && (
                      <span className="explore-card__count">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {post.imageCount}
                      </span>
                    )}
                  </div>
                  <div className="explore-card__body">
                    <h3 className="explore-card__title">{post.title}</h3>
                    {post.description && (
                      <p className="explore-card__desc">{post.description}</p>
                    )}
                    {post.creator && (
                      <div className="explore-card__creator">
                        {post.creator.image ? (
                          <img
                            src={`http://localhost:5000/${post.creator.image}`}
                            alt={post.creator.name}
                            className="explore-card__avatar"
                          />
                        ) : (
                          <div className="explore-card__avatar explore-card__avatar--placeholder">
                            {post.creator.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <span className="explore-card__creator-name">
                          {post.creator.name}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Loading more indicator */}
        {loading && !initialLoad && (
          <div className="explore-loading-more">
            <LoadingSpinner />
          </div>
        )}

        {/* End of results */}
        {!hasMore && posts.length > 0 && (
          <p className="explore-end">You've seen all the posts!</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
