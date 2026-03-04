import ExploreCard from "./ExploreCard.js";

const ExploreGrid = ({ posts, lastPostRef }) => {
  return (
    <div className="explore-grid">
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;
        return (
          <ExploreCard
            key={post.id}
            post={post}
            ref={isLast ? lastPostRef : null}
          />
        );
      })}
    </div>
  );
};

export default ExploreGrid;
