import { forwardRef } from "react";
import { Link } from "react-router-dom";

const ExploreCard = forwardRef(({ post }, ref) => {
  return (
    <Link
      to={`/post/${post.id}`}
      className="explore-card"
      ref={ref}
    >
      <div className="explore-card__image">
        <img
          src={`http://localhost:5000/${post.thumbnail}`}
          alt={post.title}
          loading="lazy"
        />
        {post.imageCount > 1 && (
          <span className="explore-card__count">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="14"
              height="14"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
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
});

ExploreCard.displayName = "ExploreCard";

export default ExploreCard;
