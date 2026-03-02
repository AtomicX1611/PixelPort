import { useState, useEffect, useCallback, useRef } from "react";
import useHttpClient from "../../shared/hooks/http-hook.js";
import LoadingSpinner from "../../shared/components/UiElements/LoadingSpinner.js";
import ErrorModal from "../../shared/components/UiElements/ErrorModal.js";
import "./Explore.css";

const Explore = () => {
  const { loading, error, sendRequest, clearError } = useHttpClient();
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalImages, setTotalImages] = useState(0);
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
    setImages([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearch]);

  // Fetch images
  const fetchImages = useCallback(async () => {
    try {
      const searchParam = debouncedSearch
        ? `&search=${encodeURIComponent(debouncedSearch)}`
        : "";
      const responseData = await sendRequest(
        `http://localhost:5000/api/places/images?page=${page}&limit=12${searchParam}`
      );
      setImages((prev) => {
        if (page === 1) return responseData.images;
        // Prevent duplicates on re-renders
        const existingIds = new Set(prev.map((img) => img.id));
        const newImages = responseData.images.filter(
          (img) => !existingIds.has(img.id)
        );
        return [...prev, ...newImages];
      });
      setHasMore(responseData.hasMore);
      setTotalImages(responseData.totalImages);
      setInitialLoad(false);
    } catch (err) {
      setInitialLoad(false);
    }
  }, [sendRequest, page, debouncedSearch]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Infinite scroll with Intersection Observer
  const lastImageRef = useCallback(
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
              {totalImages} {totalImages === 1 ? "place" : "places"} found
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

      {/* Image Grid */}
      <div className="explore-content">
        {initialLoad && loading ? (
          <div className="explore-loading">
            <LoadingSpinner />
          </div>
        ) : images.length === 0 && !loading ? (
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
            <h3>No places found</h3>
            <p>
              {debouncedSearch
                ? "Try a different search term"
                : "Be the first to share a place!"}
            </p>
          </div>
        ) : (
          <div className="explore-grid">
            {images.map((image, index) => {
              const isLast = index === images.length - 1;
              return (
                <div
                  className="explore-card"
                  key={image.id}
                  ref={isLast ? lastImageRef : null}
                >
                  <div className="explore-card__image">
                    <img
                      src={`http://localhost:5000/${image.path}`}
                      alt={image.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="explore-card__body">
                    <h3 className="explore-card__title">{image.title}</h3>
                    {image.description && (
                      <p className="explore-card__desc">{image.description}</p>
                    )}
                    {image.creator && (
                      <div className="explore-card__creator">
                        {image.creator.image ? (
                          <img
                            src={`http://localhost:5000/${image.creator.image}`}
                            alt={image.creator.name}
                            className="explore-card__avatar"
                          />
                        ) : (
                          <div className="explore-card__avatar explore-card__avatar--placeholder">
                            {image.creator.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <span className="explore-card__creator-name">
                          {image.creator.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
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
        {!hasMore && images.length > 0 && (
          <p className="explore-end">You've seen all the places!</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
