import React, { useState, useEffect } from 'react';
import usehttpClient from '../../shared/hooks/http-hook';
import Card from '../../shared/components/UiElements/Card';
import Lightbox from '../../shared/components/UiElements/Lightbox';
import './ImageGallery.css';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { loading, error, sendRequest } = usehttpClient();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const fetchImages = async (pageNumber) => {
    try {
      const response = await sendRequest(
        `http://localhost:5000/api/places/images?page=${pageNumber}&limit=12`
      );
      const newImages = response.images || [];
      if (pageNumber === 1) {
        setImages(newImages);
      } else {
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
      setHasMore(newImages.length === 12);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const ImageCard = ({ image }) => (
    <Card className="image-card">
      <div className="image-container">
        <img
          src={`http://localhost:5000/${image.path}`}
          alt={image.title}
          loading="lazy"
          onClick={() => {
            const idx = images.findIndex((img) => img.path === image.path);
            setLightboxIndex(idx >= 0 ? idx : 0);
            setLightboxOpen(true);
          }}
          style={{ cursor: 'zoom-in' }}
        />
      </div>
      <div className="image-info">
        <h3>{image.title}</h3>
        <p>{image.description}</p>
      </div>
    </Card>
  );

  return (
    <section className="gallery-section">
      <h2 className="section-title">Featured Places</h2>
      <div className="image-grid" onScroll={handleScroll}>
        {images.map((image, index) => (
          <div key={`${image.id || image._id}-${index}`} className="image-item">
            <ImageCard image={image} />
          </div>
        ))}
        {loading && Array(4).fill(null).map((_, index) => (
          <div key={`skeleton-${index}`} className="image-card skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-info">
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="error-message">
          <p>Failed to load images. Please try again later.</p>
        </div>
      )}
      {lightboxOpen && (
        <Lightbox
          images={images.map((img) => ({ src: `http://localhost:5000/${img.path}`, alt: img.title, title: img.title }))}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
};

export default ImageGallery;