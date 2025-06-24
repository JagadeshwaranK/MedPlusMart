import React, { useRef, useState, useEffect } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiStar } from "react-icons/fi";

const ProductCarousel = ({ products = [] }) => {
  const containerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    return (
      <div className="d-flex align-items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={i < fullStars ? 'text-warning' : 'text-secondary'}
            style={{ 
              fill: i < fullStars ? 'currentColor' : 'none',
              width: '16px',
              height: '16px'
            }}
          />
        ))}
        <span className="ms-1 small text-muted">({rating})</span>
      </div>
    );
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const smoothScroll = (direction) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction * 300,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!products || products.length === 0) {
    return (
      <div style={{ backgroundColor: 'hsl(198, 76%, 95%)', padding: '20px' }}>
        <div className="producthead">
          <h2>Popular Items</h2>
          <hr />
        </div>
        <div className="text-center py-4">
          <p>No products available at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="producthead">
        <h2>Popular Items</h2>
        <hr />
      </div>

      <div className="position-relative">
        {showLeftButton && (
          <button 
            className="scroll-btn left-btn position-absolute start-0 top-50 translate-middle-y z-3" 
            onClick={() => smoothScroll(-1)}
            style={{ 
              left: '-20px',
              background: 'rgba(255,255,255,0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
          >
            &lt;
          </button>
        )}

        <div 
          ref={containerRef}
          className="scroll-content d-flex overflow-auto py-3 gap-3" 
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0" style={{ width: '250px' }}>
              <Card className="h-100">
                <div className="position-relative">
                  {product.discount > 0 && (
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                      -{product.discount}% OFF
                    </Badge>
                  )}
                  <Link to={`/productdetail/${product.id}`}>
                    <Card.Img
                      variant="top"
                      src={product.image}
                      alt={product.name}
                      style={{ 
                        height: '180px', 
                        objectFit: 'contain', 
                        padding: '1rem',
                        backgroundColor: '#f8f9fa'
                      }}
                    />
                  </Link>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h6">{product.name}</Card.Title>
                  <small className="text-muted mb-1">{product.category}</small>
                  <StarRating rating={product.rating} />
                  <div className="mt-auto">
                    {product.discount > 0 ? (
                      <>
                        <h6 className="text-primary mb-1">
                          ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </h6>
                        <div className="d-flex align-items-center">
                          <del className="text-muted small me-2">₹{product.price.toFixed(2)}</del>
                          <span className="text-danger small">
                            {product.discount}% OFF
                          </span>
                        </div>
                      </>
                    ) : (
                      <h6 className="text-primary">₹{product.price.toFixed(2)}</h6>
                    )}
                  </div>
                  <div className="mt-2 pt-2">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-100"
                      as={Link}
                      to={`/productdetail/${product.id}`}
                    >
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        {showRightButton && (
          <button 
            className="scroll-btn right-btn position-absolute end-0 top-50 translate-middle-y z-3" 
            onClick={() => smoothScroll(1)}
            style={{ 
              right: '-20px',
              background: 'rgba(255,255,255,0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
          >
            &gt;
          </button>
        )}
      </div>
    </div>
  );
};

ProductCarousel.defaultProps = {
  products: []
};

export default ProductCarousel;