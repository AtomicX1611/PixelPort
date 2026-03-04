import { forwardRef } from "react";

const ExploreSearchBar = forwardRef(({ search, onSearchChange, onClear }, ref) => {
  return (
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
          ref={ref}
          type="text"
          placeholder="Search by place name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="explore-search__input"
        />
        {search && (
          <button className="explore-search__clear" onClick={onClear}>
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
  );
});

ExploreSearchBar.displayName = "ExploreSearchBar";

export default ExploreSearchBar;
