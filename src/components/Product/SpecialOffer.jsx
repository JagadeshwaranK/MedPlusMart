import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { FiStar, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import healthcareProducts from '../Product/ProductData';
import '../../styles/SpecialOffer.css';

const SpecialOffer = ({ addToCart }) => {
  const [loading, setLoading] = useState(true);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Initialize and filter products
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    
    // Enhance product data with ratings and identify discounted items
    const enhancedProducts = healthcareProducts.map(product => ({
      ...product,
      rating: (Math.random() * 5).toFixed(1),
      reviewCount: Math.floor(Math.random() * 100),
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : 0
    }));

    // Get only products with discounts
    const discountedItems = enhancedProducts.filter(product => product.discount > 0);
    setDiscountedProducts(discountedItems);
    setFilteredProducts(discountedItems);

    return () => clearTimeout(timer);
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (discountedProducts.length === 0) return;

    const filtered = discountedProducts.filter(product => {
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      return categoryMatch && priceMatch;
    });

    setFilteredProducts(filtered);
  }, [selectedCategory, priceRange, discountedProducts]);

  const categories = ['All', ...new Set(discountedProducts.map(p => p.category))];

  const handleAddToCart = (product) => {
    if (product.stock === 0) return;
    
    const cartItem = {
      ...product,
      finalPrice: product.price * (1 - product.discount / 100),
      quantity: 1
    };

    if (addToCart) addToCart(cartItem);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="special-offers-container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <Button variant="link" as={Link} to="/products" className="me-2 p-0">
            <FiArrowLeft size={24} />
          </Button>
          Special Offers
          <Badge bg="danger" className="ms-2">
            {discountedProducts.length} Discounted Items
          </Badge>
        </h2>
      </div>

      <Row>
        {/* Filters Sidebar */}
        <Col md={3} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Filter Offers</h5>
              
              <div className="mb-4">
                <h6>Categories</h6>
                <div className="d-flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'primary' : 'outline-secondary'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="category-chip"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h6>Price Range</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="1000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                />
              </div>

              <div className="mb-3">
                <h6>Discount Range</h6>
                <div className="discount-tiers">
                  <Button variant="outline-danger" size="sm" className="me-2 mb-2">
                    5-15% OFF
                  </Button>
                  <Button variant="outline-danger" size="sm" className="me-2 mb-2">
                    15-25% OFF
                  </Button>
                  <Button variant="outline-danger" size="sm" className="mb-2">
                    25%+ OFF
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Products Grid */}
        <Col md={9}>
          {filteredProducts.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <h4>No discounted products found</h4>
                <p>Try adjusting your filters or check back later for new offers</p>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedCategory('All');
                    setPriceRange([0, 1000]);
                  }}
                >
                  Reset Filters
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row xs={1} sm={2} lg={3} className="g-4">
              {filteredProducts.map(product => (
                <Col key={product.id}>
                  <Card className="h-100 offer-card">
                    <div className="offer-badge">
                      <Badge bg="danger">
                        {product.discount}% OFF
                      </Badge>
                      {product.stock < 10 && product.stock > 0 && (
                        <Badge bg="warning" className="ms-1">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <Link to={`/productdetail/${product.id}`}>
                      <Card.Img
                        variant="top"
                        src={product.image}
                        alt={product.name}
                        className="offer-img"
                      />
                    </Link>
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        <span className="text-muted small">{product.category}</span>
                        <div className="small text-truncate">
                          <strong>Active:</strong> {product.activeIngredients}
                        </div>
                      </div>
                      <Card.Title className="mb-2">
                        <Link to={`/productdetail/${product.id}`} className="text-decoration-none">
                          {product.name}
                        </Link>
                      </Card.Title>
                      <div className="mb-2">
                        <FiStar className="text-warning" /> {product.rating}
                        <span className="text-muted small ms-1">({product.reviewCount})</span>
                      </div>
                      <div className="mt-auto">
                        <div className="d-flex align-items-center mb-2">
                          <h4 className="text-primary mb-0">
                            ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                          </h4>
                          <del className="text-muted small ms-2">
                            ₹{product.price.toFixed(2)}
                          </del>
                        </div>
                        <div className="d-grid gap-2">
                          <Button
                            variant="primary"
                            as={Link}
                            to={`/productdetail/${product.id}`}
                            size="sm"
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            disabled={product.stock === 0}
                            onClick={() => handleAddToCart(product)}
                          >
                            <FiShoppingCart className="me-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Limited Time Offer Banner */}
      {filteredProducts.length > 0 && (
        <div className="limited-offer-banner mt-5 p-4 text-center">
          <h3 className="text-white">⏰ Limited Time Offers!</h3>
          <p className="text-white mb-3">
            These discounted healthcare products won't last long. Shop now before they're gone!
          </p>
          <Button variant="light" size="lg">
            Shop All Deals
          </Button>
        </div>
      )}
    </Container>
  );
};

export default SpecialOffer;