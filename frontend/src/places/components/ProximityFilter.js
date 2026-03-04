const ProximityFilter = ({ proximity, onToggle, radius, onRadiusChange }) => {
  return (
    <div className="explore-proximity">
      <button
        type="button"
        className={`explore-proximity__toggle ${proximity ? "active" : ""}`}
        onClick={onToggle}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          width="16"
          height="16"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Include nearby places
      </button>
      {proximity && (
        <select
          className="explore-proximity__radius"
          value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
        >
          <option value={50}>50 km</option>
          <option value={100}>100 km</option>
          <option value={200}>200 km</option>
          <option value={500}>500 km</option>
        </select>
      )}
    </div>
  );
};

export default ProximityFilter;
