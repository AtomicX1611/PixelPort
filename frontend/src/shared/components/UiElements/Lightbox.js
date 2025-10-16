import React, { useEffect } from 'react';
import './Lightbox.css';

const Lightbox = ({ images = [], startIndex = 0, onClose }) => {
  const [index, setIndex] = React.useState(startIndex);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  const goNext = () => setIndex((i) => (i + 1) % images.length);
  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  if (!images || images.length === 0) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" aria-label="Close" onClick={onClose}>×</button>
        {images.length > 1 && (
          <button className="lightbox-prev" aria-label="Previous" onClick={goPrev}>‹</button>
        )}
        <div className="lightbox-image-wrap">
          <img
            src={images[index].src}
            alt={images[index].alt || images[index].title || `image-${index}`}
            className="lightbox-image"
          />
          {images[index].title && <div className="lightbox-caption">{images[index].title}</div>}
        </div>
        {images.length > 1 && (
          <button className="lightbox-next" aria-label="Next" onClick={goNext}>›</button>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
