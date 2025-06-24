import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Loader.css';
import productsData from "../Product/ProductData";

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call with 1s delay
    const timer = setTimeout(() => {
      // Enhance products with random ratings and discounts like in ProductList
      const enhancedProducts = productsData.map(p => ({
        ...p,
        rating: (Math.random() * 5).toFixed(1),
        reviewCount: Math.floor(Math.random() * 100),
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : 0
      }));

      const productData = enhancedProducts.find(p => p.id === parseInt(id));
      
      if (productData) {
        setProduct(productData);
        // Get 4 random related products (same category but different product)
        const related = enhancedProducts
          .filter(p => p.category === productData.category && p.id !== productData.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        navigate('/not-found');
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (quantity < 1 || quantity > product.stock) {
      alert(`Please enter a quantity between 1 and ${product.stock}`);
      return;
    }
    
    addToCart({
      ...product,
      finalPrice: product.discount > 0 
        ? product.price * (1 - product.discount / 100)
        : product.price
    }, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Loading product details...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <Container className="py-5">
      <h1 className='text-center fs-2 mb-4'>Product Details</h1>

      <Row className="g-4">
        {/* Main Product Image */}
        <Col lg={6}>
          <Card className="h-100 border-0 shadow-sm">
            <div className="product-badge">
              {product.discount > 0 && (
                <Badge bg="danger" className="position-absolute top-0 start--3 ">
                  -{product.discount}% OFF
                </Badge>
              )}
              {product.stock < 10 && product.stock > 0 && (
                <Badge bg="warning" className="position-absolute top-0 end-0 m-2">
                  Low Stock
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge bg="secondary" className="position-absolute top-0 end-0 m-2">
                  Out of Stock
                </Badge>
              )}
            </div>
            <Card.Img 
              variant="top" 
              src={product.image} 
              alt={product.name}
              className="p-3"
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
          </Card>
        </Col>

        {/* Product Details */}
        <Col lg={6}>
          <Card className="h-100 border-0">
            <Card.Body>
              <Card.Title as="h1" className="mb-3">{product.name}</Card.Title>
              
              <div className="d-flex align-items-center mb-3">
                <Badge bg="success" className="me-2">{product.category}</Badge>
                <div className="text-warning">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={i < Math.floor(product.rating) ? 'text-warning' : 'text-secondary'}
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="ms-2 small">({product.rating} stars, {product.reviewCount} reviews)</span>
              </div>

              {product.discount > 0 ? (
                <div className="mb-3">
                  <h3 className="text-primary">
                    ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </h3>
                  <div className="d-flex align-items-center">
                    <del className="text-muted me-2">₹{product.price.toFixed(2)}</del>
                    <span className="text-danger">
                      {product.discount}% OFF
                    </span>
                  </div>
                </div>
              ) : (
                <h3 className="text-primary mb-3">₹{product.price.toFixed(2)}</h3>
              )}

              <Card.Text className="mb-4">
                <strong>Availability:</strong> 
                <span className={product.stock > 0 ? 'text-success ms-2' : 'text-danger ms-2'}>
                  {product.stock > 0 ? ` In Stock (${product.stock} available)` : ' Out of Stock'}
                </span>
                <br />
                <strong>Description:</strong> {product.description}
                {product.ingredients && (
                  <>
                    <br />
                    <strong>Ingredients:</strong> {product.ingredients}
                  </>
                )}
              </Card.Text>

              {/* Quantity Selector */}
              <div className="d-flex align-items-center mb-4">
                <div className="me-3">
                  <label htmlFor="quantity" className="form-label">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    className="form-control"
                    style={{ width: '80px' }}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                    min="1"
                    max={product.stock}
                    disabled={product.stock <= 0}
                  />
                </div>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <FiShoppingCart className="me-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Product Highlights */}
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Product Highlights</Card.Title>
                  <ul className="list-unstyled">
                    <li><span className="text-success me-2">✓</span> Genuine product</li>
                    <li><span className="text-success me-2">✓</span> Free delivery on orders over ₹500</li>
                    <li><span className="text-success me-2">✓</span> Easy returns</li>
                  </ul>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Related Products */}
      <div className="mt-5">
        <h2 className="mb-4">Related Products</h2>
        <Row className="g-4">
          {relatedProducts.map((related) => (
            <Col xs={12} sm={6} md={4} lg={3} key={related.id}>
              <Card className="h-100 product-card">
                <div className="product-badge">
                  {related.discount > 0 && (
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                      -{related.discount}% OFF
                    </Badge>
                  )}
                  {related.stock < 10 && related.stock > 0 && (
                    <Badge bg="warning" className="position-absolute top-0 end-0 m-2">
                      Low Stock
                    </Badge>
                  )}
                  {related.stock === 0 && (
                    <Badge bg="secondary" className="position-absolute top-0 end-0 m-2">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <Link to={`/productdetail/${related.id}`}>
                  <Card.Img 
                    variant="top" 
                    src={related.image} 
                    alt={related.name}
                    className="p-3"
                    style={{ height: '200px', objectFit: 'contain' }}
                  />
                </Link>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="mb-2">
                    <Link to={`/productdetail/${related.id}`} className="text-decoration-none">
                      {related.name}
                    </Link>
                  </Card.Title>
                  <div className="mb-2">
                    <span className="text-muted small">{related.category}</span>
                  </div>
                  <div className="mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={i < Math.floor(related.rating) ? 'text-warning' : 'text-secondary'}
                        fill={i < Math.floor(related.rating) ? 'currentColor' : 'none'}
                      />
                    ))}
                    <span className="ms-1 small">({related.rating})</span>
                  </div>
                  <div className="mt-auto">
                    {related.discount > 0 ? (
                      <>
                        <h5 className="text-primary mb-1">
                          ₹{(related.price * (1 - related.discount / 100)).toFixed(2)}
                        </h5>
                        <div className="d-flex align-items-center">
                          <del className="text-muted small me-2">₹{related.price.toFixed(2)}</del>
                          <span className="text-danger small">
                            {related.discount}% OFF
                          </span>
                        </div>
                      </>
                    ) : (
                      <h5 className="text-primary">₹{related.price.toFixed(2)}</h5>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default ProductDetail;