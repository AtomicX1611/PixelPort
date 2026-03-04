import { useState, useEffect, useCallback, useRef } from "react";
import useHttpClient from "../../shared/hooks/http-hook.js";
import LoadingSpinner from "../../shared/components/UiElements/LoadingSpinner.js";
import ErrorModal from "../../shared/components/UiElements/ErrorModal.js";
import ExploreSearchBar from "../components/ExploreSearchBar.js";
import ProximityFilter from "../components/ProximityFilter.js";
import ExploreGrid from "../components/ExploreGrid.js";
import ExploreEmpty from "../components/ExploreEmpty.js";
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
  const [proximity, setProximity] = useState(false);
  const [radius, setRadius] = useState(100);
  const [proximityCenter, setProximityCenter] = useState(null);
  const observer = useRef();
  const searchInputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setProximityCenter(null);
  }, [debouncedSearch, proximity, radius]);

  const fetchPosts = useCallback(async () => {
    try {
      const searchParam = debouncedSearch
        ? `&search=${encodeURIComponent(debouncedSearch)}`
        : "";
      const proximityParam =
        proximity && debouncedSearch
          ? `&proximity=true&radius=${radius}`
          : "";
      const responseData = await sendRequest(
        `http://localhost:5000/api/places/images?page=${page}&limit=12${searchParam}${proximityParam}`
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
      setProximityCenter(responseData.proximityCenter || null);
      setInitialLoad(false);
    } catch (err) {
      setInitialLoad(false);
    }
  }, [sendRequest, page, debouncedSearch, proximity, radius]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
      <div className="explore-hero">
        <div className="explore-hero__inner">
          <h1 className="explore-hero__title">Explore Places</h1>
          <p className="explore-hero__subtitle">
            Discover amazing places shared by our community
          </p>

          <ExploreSearchBar
            ref={searchInputRef}
            search={search}
            onSearchChange={setSearch}
            onClear={clearSearch}
          />

          {search && (
            <ProximityFilter
              proximity={proximity}
              onToggle={() => setProximity((prev) => !prev)}
              radius={radius}
              onRadiusChange={setRadius}
            />
          )}

          {!initialLoad && (
            <p className="explore-hero__count">
              {totalPosts} {totalPosts === 1 ? "post" : "posts"} found
              {debouncedSearch && (
                <span>
                  {" "}
                  for "<strong>{debouncedSearch}</strong>"
                </span>
              )}
              {proximityCenter && (
                <span className="explore-hero__proximity-info">
                  {" "}
                  &middot; within {radius} km of{" "}
                  <strong>{proximityCenter.name?.split(",")[0]}</strong>
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <ErrorModal error={error} onClear={clearError} />

      <div className="explore-content">
        {initialLoad && loading ? (
          <div className="explore-loading">
            <LoadingSpinner />
          </div>
        ) : posts.length === 0 && !loading ? (
          <ExploreEmpty hasSearch={!!debouncedSearch} />
        ) : (
          <ExploreGrid posts={posts} lastPostRef={lastPostRef} />
        )}

        {loading && !initialLoad && (
          <div className="explore-loading-more">
            <LoadingSpinner />
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <p className="explore-end">You've seen all the posts!</p>
        )}
      </div>
    </div>
  );
};

export default Explore;

//Eiffel tower -> lat 51 , long 0.13
//two units beside london -> lat 53, long 0.13
//ten units beside london -> lat 61, long 0.13
//twenty units beside london -> lat 75, long 0.13