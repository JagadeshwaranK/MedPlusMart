import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Spinner, Offcanvas, Badge } from 'react-bootstrap';
import { FiFilter, FiX, FiStar, FiShoppingCart } from 'react-icons/fi';
import healthcareProducts from '../Product/HealthcareProducts';
import '../../styles/Sidebar.css';

const Healthcare = ({ addToCart }) => {
  // State management
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Initialize products with enhanced data
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 992);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    // Enhance product data with ratings and discounts
    const enhancedProducts = healthcareProducts.map(product => ({
      ...product,
      rating: (Math.random() * 5).toFixed(1),
      reviewCount: Math.floor(Math.random() * 100),
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : 0
    }));

    setProducts(enhancedProducts);
    const timer = setTimeout(() => setLoading(false), 800);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Derived values
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const ratingOptions = [4, 3, 2, 1];
  const discountedProducts = products.filter(product => product.discount > 0);

  // Helper functions
  const toggleRating = (rating) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating) 
        : [...prev, rating]
    );
  };

  const handleAddToCart = (product) => {
    if (product.stock === 0) return;
    
    const cartItem = {
      ...product,
      finalPrice: product.discount > 0 
        ? product.price * (1 - product.discount / 100)
        : product.price,
      quantity: 1
    };

    if (addToCart) addToCart(cartItem);
    navigate('/cart');
  };

  // Product filtering logic
  const filteredProducts = products.filter(product => {
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    const discountMatch = !showDiscountedOnly || product.discount > 0;
    const stockMatch = !inStockOnly || product.stock > 0;
    const ratingMatch = selectedRatings.length === 0 || 
                       selectedRatings.some(r => product.rating >= r);
    
    return searchMatch && categoryMatch && priceMatch && 
           discountMatch && stockMatch && ratingMatch;
  });

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="product-list-container">
      {/* Discount Badge */}
      {discountedProducts.length > 0 && (
        <div className="discount-badge" onClick={() => setShowDiscountedOnly(!showDiscountedOnly)}>
          <Badge bg="danger" pill>
            {discountedProducts.length} Discounted Items
          </Badge>
        </div>
      )}

      <Row>
        {/* Desktop Sidebar */}
        {!mobileView && (
          <Col md={3} lg={2} className="sidebar d-none d-md-block">
            <div className="sidebar-sticky pt-3">
              <h5 className="px-3 mb-3">Categories</h5>
              <nav className="nav flex-column">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`nav-link category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </nav>

              <div className="px-3 mt-4">
                <h5>Price Range</h5>
                <Form.Range
                  min={0}
                  max={1000}
                  step={50}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                />
                <div className="d-flex justify-content-between">
                  <span>₹0</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              <div className="px-3 mt-4">
                <h5>Rating</h5>
                {ratingOptions.map(rating => (
                  <div key={rating} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`rating-${rating}`}
                      checked={selectedRatings.includes(rating)}
                      onChange={() => toggleRating(rating)}
                    />
                    <label className="form-check-label" htmlFor={`rating-${rating}`}>
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={i < rating ? 'text-warning' : 'text-secondary'}
                          size={14}
                        />
                      ))} & Up
                    </label>
                  </div>
                ))}
              </div>

              <div className="px-3 mt-4">
                <h5>Special Offers</h5>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="discountCheck"
                    checked={showDiscountedOnly}
                    onChange={() => setShowDiscountedOnly(!showDiscountedOnly)}
                  />
                  <label className="form-check-label" htmlFor="discountCheck">
                    Discounted Items ({discountedProducts.length})
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="stockCheck"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                  />
                  <label className="form-check-label" htmlFor="stockCheck">
                    In Stock Only
                  </label>
                </div>
              </div>
            </div>
          </Col>
        )}

        {/* Mobile Filter Button */}
        {mobileView && (
          <div className="mobile-filter-btn">
            <Button variant="primary" onClick={() => setShowSidebar(true)}>
              <FiFilter className="me-2" /> Filters
            </Button>
          </div>
        )}

        {/* Mobile Sidebar Offcanvas */}
        {mobileView && (
          <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Filter Products</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <h5 className="mb-3">Categories</h5>
              <nav className="nav flex-column">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`nav-link category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowSidebar(false);
                    }}
                  >
                    {category}
                  </button>
                ))}
              </nav>

              <div className="mt-4">
                <h5>Price Range</h5>
                <Form.Range
                  min={0}
                  max={1000}
                  step={50}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                />
                <div className="d-flex justify-content-between">
                  <span>₹0</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              <div className="mt-4">
                <h5>Rating</h5>
                {ratingOptions.map(rating => (
                  <div key={rating} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`m-rating-${rating}`}
                      checked={selectedRatings.includes(rating)}
                      onChange={() => toggleRating(rating)}
                    />
                    <label className="form-check-label" htmlFor={`m-rating-${rating}`}>
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={i < rating ? 'text-warning' : 'text-secondary'}
                          size={14}
                        />
                      ))} & Up
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h5>Special Offers</h5>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="m-discountCheck"
                    checked={showDiscountedOnly}
                    onChange={() => setShowDiscountedOnly(!showDiscountedOnly)}
                  />
                  <label className="form-check-label" htmlFor="m-discountCheck">
                    Discounted Items ({discountedProducts.length})
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="m-stockCheck"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                  />
                  <label className="form-check-label" htmlFor="m-stockCheck">
                    In Stock Only
                  </label>
                </div>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        )}

        {/* Main Product Grid */}
        <Col md={9} lg={10} className="main-content">
          <Row className="justify-content-center mb-4">
            <Col xs={12} md={8} lg={6}>
              <Form.Group className="search-box text-center" controlId="search">
                <Form.Control
                  type="text"
                  placeholder="Search healthcare products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mx-auto"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              {selectedCategory === 'All' ? 'Healthcare Products' : selectedCategory}
              <small className="text-muted ms-2">({filteredProducts.length} items)</small>
            </h2>
            {!mobileView && (
              <div className="d-flex">
                {showDiscountedOnly && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="me-2"
                    onClick={() => setShowDiscountedOnly(false)}
                  >
                    Showing Discounted <FiX />
                  </Button>
                )}
                {inStockOnly && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => setInStockOnly(false)}
                  >
                    In Stock Only <FiX />
                  </Button>
                )}
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <h4>No products found</h4>
              <p>Try adjusting your search or filter criteria</p>
              <Button variant="outline-primary" onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setPriceRange([0, 1000]);
                setShowDiscountedOnly(false);
                setInStockOnly(false);
                setSelectedRatings([]);
              }}>
                Reset All Filters
              </Button>
            </div>
          ) : (
            <Row className="g-4">
              {filteredProducts.map(product => (
                <Col xs={12} sm={6} md={6} lg={4} xl={3} key={product.id}>
                  <Card className="h-100 product-card">
                    <div className="product-badge">
                      {product.discount > 0 && (
                        <span className="badge bg-danger">-{product.discount}% OFF</span>
                      )}
                      {product.stock < 10 && product.stock > 0 && (
                        <span className="badge bg-warning">Low Stock</span>
                      )}
                      {product.stock === 0 && (
                        <span className="badge bg-secondary">Out of Stock</span>
                      )}
                    </div>
                    <Link to={`/productdetail/${product.id}`}>
                      <Card.Img 
                        variant="top" 
                        src={product.image} 
                        alt={product.name}
                        className="product-img"
                      />
                    </Link>
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        <span className="text-muted small">{product.category}</span>
                        <div className="small">
                          <strong>Active Ingredient:</strong> {product.activeIngredients}
                        </div>
                      </div>
                      <Card.Title className="mb-2">
                        <Link to={`/productdetail/${product.id}`} className="text-decoration-none">
                          {product.name}
                        </Link>
                      </Card.Title>
                      <div className="mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={i < Math.floor(product.rating) ? 'text-warning' : 'text-secondary'}
                          />
                        ))}
                        <span className="ms-1 small">({product.rating} stars, {product.reviewCount} reviews)</span>
                      </div>
                      <div className="mt-auto">
                        {product.discount > 0 ? (
                          <>
                            <h5 className="text-primary mb-1">
                              ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                            </h5>
                            <div className="d-flex align-items-center">
                              <del className="text-muted small me-2">₹{product.price.toFixed(2)}</del>
                              <span className="text-danger small">
                                {product.discount}% OFF
                              </span>
                            </div>
                          </>
                        ) : (
                          <h5 className="text-primary mb-3">₹{product.price.toFixed(2)}</h5>
                        )}
                        <div className="d-grid gap-2">
                          <Button 
                            variant="primary" 
                            as={Link} 
                            to={`/productdetail/${product.id}`}
                            className="mb-2"
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline-primary" 
                            disabled={product.stock === 0}
                            onClick={() => handleAddToCart(product)}
                          >
                            <FiShoppingCart className="me-2" />
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
    </Container>
  );
};

export default Healthcare;