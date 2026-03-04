const ExploreEmpty = ({ hasSearch }) => {
  return (
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
        {hasSearch
          ? "Try a different search term"
          : "Be the first to share a place!"}
      </p>
    </div>
  );
};

export default ExploreEmpty;
