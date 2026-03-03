import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useHttpClient from "../../shared/hooks/http-hook.js";
import LoadingSpinner from "../../shared/components/UiElements/LoadingSpinner.js";
import ErrorModal from "../../shared/components/UiElements/ErrorModal.js";
import Button from "../../shared/components/UiElements/Button.js";
import Modal from "../../shared/components/UiElements/Modal.js";
import GMap from "../../shared/components/UiElements/Map.js";
import { AuthContext } from "../../context/AuthContext.js";
import "./PostDetail.css";

const PostDetail = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { loading, error, sendRequest, clearError } = useHttpClient();
  const [place, setPlace] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [explorePosts, setExplorePosts] = useState([]);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/places/${pid}`
        );
        setPlace(data.place);
        setSelectedImg(0);
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, pid]);

  // Fetch other posts by same user
  useEffect(() => {
    if (!place?.creatorID) return;
    const creatorId = typeof place.creatorID === 'object' ? place.creatorID._id : place.creatorID;
    const fetchUserPosts = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/places/user/${creatorId}`
        );
        const others = (data.places || []).filter(
          (p) => (p._id || p.id) !== pid
        );
        setUserPosts(others.slice(0, 6));
      } catch (err) {}
    };
    fetchUserPosts();
  }, [sendRequest, place?.creatorID, pid]);

  // Fetch explore / related posts
  useEffect(() => {
    const fetchExplorePosts = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/places/images?page=1&limit=7`
        );
        const others = (data.posts || []).filter((p) => p.id !== pid);
        setExplorePosts(others.slice(0, 6));
      } catch (err) {}
    };
    fetchExplorePosts();
  }, [sendRequest, pid]);

  const confirmDeleteHandler = async () => {
    setShowDeleteModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${pid}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      navigate("/" + auth.userId + "/places");
    } catch (err) {}
  };

  const images = place?.images || (place?.imageUrl ? [place.imageUrl] : []);
  const isOwner =
    auth.userId &&
    (place?.creatorID?._id === auth.userId ||
      place?.creatorID?.toString() === auth.userId ||
      place?.creatorID === auth.userId);

  if (loading && !place) {
    return (
      <div className="post-detail__loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (!place && !loading) {
    return (
      <div className="post-detail__not-found">
        <h2>Post not found</h2>
        <Link to="/explore">Back to Explore</Link>
      </div>
    );
  }

  if (!place) return null;

  return (
    <div className="post-detail">
      <ErrorModal error={error} onClear={clearError} />

      {/* Map Modal */}
      <Modal
        show={showMap}
        onCancel={() => setShowMap(false)}
        header={place.address}
        footer={<Button onClick={() => setShowMap(false)}>CLOSE</Button>}
      >
        <div className="post-detail__map">
          <GMap lat={place.location?.lat} lng={place.location?.lng} />
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        header="Are you sure?"
        footer={
          <>
            <Button inverse onClick={() => setShowDeleteModal(false)}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this post? This action cannot be
          undone.
        </p>
      </Modal>

      <div className="post-detail__container">
        {/* Image Gallery */}
        <div className="post-detail__gallery">
          <div className="post-detail__main-image">
            {images.length > 0 ? (
              <img
                src={`http://localhost:5000/${images[selectedImg]}`}
                alt={`${place.title} - ${selectedImg + 1}`}
              />
            ) : (
              <div className="post-detail__no-image">No images</div>
            )}
            {images.length > 1 && (
              <div className="post-detail__img-counter">
                {selectedImg + 1} / {images.length}
              </div>
            )}
            {images.length > 1 && selectedImg > 0 && (
              <button
                className="post-detail__nav post-detail__nav--prev"
                onClick={() => setSelectedImg((p) => p - 1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {images.length > 1 && selectedImg < images.length - 1 && (
              <button
                className="post-detail__nav post-detail__nav--next"
                onClick={() => setSelectedImg((p) => p + 1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          {images.length > 1 && (
            <div className="post-detail__thumbnails">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`post-detail__thumb ${
                    i === selectedImg ? "post-detail__thumb--active" : ""
                  }`}
                  onClick={() => setSelectedImg(i)}
                >
                  <img
                    src={`http://localhost:5000/${img}`}
                    alt={`Thumb ${i + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Post Info */}
        <div className="post-detail__info">
          <h1 className="post-detail__title">{place.title}</h1>

          {place.creatorID && typeof place.creatorID === "object" && (
            <div className="post-detail__creator">
              {place.creatorID.image ? (
                <img
                  src={`http://localhost:5000/${place.creatorID.image}`}
                  alt={place.creatorID.name}
                  className="post-detail__avatar"
                />
              ) : (
                <div className="post-detail__avatar post-detail__avatar--placeholder">
                  {place.creatorID.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <span>{place.creatorID.name}</span>
            </div>
          )}

          {place.address && (
            <div className="post-detail__address">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{place.address}</span>
            </div>
          )}

          {place.desc && (
            <p className="post-detail__desc">{place.desc}</p>
          )}

          <div className="post-detail__meta">
            {images.length > 0 && (
              <span className="post-detail__badge">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {images.length} {images.length === 1 ? "photo" : "photos"}
              </span>
            )}
          </div>

          <div className="post-detail__actions">
            <Button onClick={() => setShowMap(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View Map
            </Button>
            {isOwner && (
              <>
                <Button to={`/places/${place._id || place.id}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Button>
                <Button danger onClick={() => setShowDeleteModal(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* More from this user */}
      {userPosts.length > 0 && (
        <section className="post-detail__section">
          <div className="post-detail__section-header">
            <h2>
              More from{" "}
              {place.creatorID && typeof place.creatorID === "object"
                ? place.creatorID.name
                : "this user"}
            </h2>
            {place.creatorID && (
              <Link
                to={`/${
                  typeof place.creatorID === "object"
                    ? place.creatorID._id
                    : place.creatorID
                }/places`}
                className="post-detail__section-link"
              >
                View all
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
          <div className="post-detail__related-grid">
            {userPosts.map((p) => {
              const imgs = p.images || (p.imageUrl ? [p.imageUrl] : []);
              return (
                <Link
                  to={`/post/${p._id || p.id}`}
                  className="post-detail__related-card"
                  key={p._id || p.id}
                >
                  <div className="post-detail__related-img">
                    {imgs[0] ? (
                      <img
                        src={`http://localhost:5000/${imgs[0]}`}
                        alt={p.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="post-detail__related-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {imgs.length > 1 && (
                      <span className="post-detail__related-count">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="12" height="12">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {imgs.length}
                      </span>
                    )}
                  </div>
                  <div className="post-detail__related-body">
                    <h3>{p.title}</h3>
                    {p.address && <span className="post-detail__related-address">{p.address}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* You might also like */}
      {explorePosts.length > 0 && (
        <section className="post-detail__section">
          <div className="post-detail__section-header">
            <h2>You might also like</h2>
            <Link to="/explore" className="post-detail__section-link">
              Explore all
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="post-detail__related-grid">
            {explorePosts.map((p) => (
              <Link
                to={`/post/${p.id}`}
                className="post-detail__related-card"
                key={p.id}
              >
                <div className="post-detail__related-img">
                  {p.thumbnail ? (
                    <img
                      src={`http://localhost:5000/${p.thumbnail}`}
                      alt={p.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="post-detail__related-placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {p.imageCount > 1 && (
                    <span className="post-detail__related-count">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="12" height="12">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {p.imageCount}
                    </span>
                  )}
                </div>
                <div className="post-detail__related-body">
                  <h3>{p.title}</h3>
                  {p.creator && (
                    <div className="post-detail__related-creator">
                      {p.creator.image ? (
                        <img
                          src={`http://localhost:5000/${p.creator.image}`}
                          alt={p.creator.name}
                        />
                      ) : (
                        <div className="post-detail__related-avatar-placeholder">
                          {p.creator.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <span>{p.creator.name}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PostDetail;
