import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/home.css'; 
import '../styles/faq.css';
import { BiPhoneCall } from "react-icons/bi";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Button, Badge, Card } from "react-bootstrap";
import productsData from "../components/Product/ProductData";
import { FiStar } from "react-icons/fi";
import LimitedOffer from "./LimitedOffer";
import ProductCarousel from "../components/Product/ProductCarousel";

const Home = () => {
  const [counter, setCounter] = useState(0);
  const [randomProducts, setRandomProducts] = useState([]);
  const [randomPopular, setRandomPopular] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);                                             
  const navigate = useNavigate();
  const [pincode, setPincode] = useState('');
  const [location, setLocation] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [showLeftButton, setShowLeftButton] = useState(false);

  // Initialize products and categories from local data
  useEffect(() => {
    const enhancedProducts = productsData.map(p => ({
      ...p,
      rating: (Math.random() * 5).toFixed(1),
      reviewCount: Math.floor(Math.random() * 100),
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : 0
    }));

    // Get unique categories
    const uniqueCategories = [...new Set(productsData.map(product => product.category))];
    setCategories(uniqueCategories);
    setProducts(enhancedProducts);
    
    // Set random featured products (first 4)
    setRandomProducts(enhancedProducts.slice(0, 4));
    
    // Set popular items (shuffled array of all products)
    setRandomPopular([...enhancedProducts].sort(() => 0.5 - Math.random()));
  }, []);

  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
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

  // Slider animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev >= 3 ? 0 : prev + 1)); 
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const radio = document.getElementById(`radio${counter}`);
    if (radio) {
      radio.checked = true;
    }
  }, [counter]);

  const handleShowMore = (category) => {
    navigate(`/productlist?category=${encodeURIComponent(category)}`);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  // Handle search input changes for suggestions
  const handleSearchChange = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setSearchQuery(query);
  
    // Only show suggestions if query has at least 1 character
    if (query.length > 0) {
      const filteredSuggestions = productsData
        .filter(product => {
          const startsWithMatch = product.name.toLowerCase().startsWith(query);
          const containsMatch = product.name.toLowerCase().includes(query) ||
                              product.description.toLowerCase().includes(query) ||
                              product.category.toLowerCase().includes(query);
          return startsWithMatch || containsMatch;
        })
        .sort((a, b) => {
          const aStartsWith = a.name.toLowerCase().startsWith(query);
          const bStartsWith = b.name.toLowerCase().startsWith(query);
          
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return a.name.localeCompare(b.name);
        })
        .map(product => product.name)
        .filter((name, index, self) => self.indexOf(name) === index)
        .slice(0, 5);
  
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    navigate(`/search?query=${suggestion}`);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredProducts = activeCategory 
    ? products.filter(product => product.category === activeCategory)
    : products;

  // Scroll functions for popular items
  const handleScroll = () => {
    const container = document.getElementById("popular-items-container");
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
    }
  }; 

  
  function smoothScroll(direction) {
    const container = document.getElementById("popular-items-container");
    const scrollAmount = 300; 
    const scrollStep = 10; 
    const totalSteps = scrollAmount / scrollStep;
    let currentStep = 0;
  
    function scrollFrame() {
      if (currentStep < totalSteps) {
        container.scrollBy({ left: direction * scrollStep, behavior: "auto" });
        currentStep += 1;
        requestAnimationFrame(scrollFrame);
      }
    }
  
    scrollFrame();
  }

  // Testimonials data
  const testimonials = [
    {
      highlight: "Doctors are very professional and customer friendly.",
      message: "Perfect. The more I use this app, the more I fall in love with it. Doctors are very professional and customer friendly.",
      author: "Subhash Sehgal",
    },
    {
      highlight: "Used the app and found it easy to use.",
      message: "Excellent app. Have used this regularly and found it very easy to use. All info is readily available and the response after order placement for validation of medicines required was prompt.",
      author: "Snehal Shah",
    },
    {
      highlight: "Best, very customer-friendly app.",
      message: "Truemeds is the best... during the lockdown, this app did not reduce the discount, which shows the customer-friendly nature of TrueMeds.",
      author: "Laksh Kankariya",
    },
    {
      highlight: "Truly affordable medicines.",
      message: "Affordable medicines on this app. Truemeds is true.",
      author: "Zahiruddin Warekar",
    },
    {
      highlight: "Quick delivery and great service.",
      message: "I received my medicines on time and at a much lower cost. The service is excellent!",
      author: "Sumit Kumar",
    }
  ];    

  // FAQ data
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "You can place an order by searching for products, adding them to your cart, and proceeding to checkout. Alternatively, you can upload a prescription or call us to place your order."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, net banking, UPI payments, and cash on delivery (where available)."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery typically takes 2-3 business days for metro cities and 3-5 business days for other locations. Express delivery options are available in select areas."
    },
    {
      question: "Can I return medicines?",
      answer: "Due to regulatory restrictions, we cannot accept returns of medicines unless they are damaged or incorrect. Please check your order carefully before confirming."
    },
    {
      question: "Do you offer discounts?",
      answer: "Yes, we regularly offer discounts on various products. Check our offers section or use coupon codes during checkout to avail discounts."
    }
  ];

  // Location functions
  const handlePincodeSubmit = async () => {
    if (pincode.length === 6) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${pincode}&format=json`
        );
        const data = await response.json();
        if (data && data[0]) {
          setLocation(data[0].display_name);
          setPopupVisible(false);
        } else {
          alert("Unable to fetch location for the given PIN code.");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    } else {
      alert("Please enter a valid 6-digit PIN code.");
    }
  };
  
  const handleCurrentLocation = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data && data.display_name) {
            setLocation(data.display_name);
            setPopupVisible(false); 
          } else {
            alert("Unable to fetch location for your current position.");
          }
        } catch (error) {
          console.error("Error fetching location from current position:", error);
        }
      }, (error) => {
        console.error("Error accessing current location:", error);
        alert("Unable to fetch your current location.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <>
      {/* Search Section */}
      <div style={{ backgroundColor: 'hsl(198, 76%, 95%)', padding: '10px' }}>
        <div className="search mt-5 text-center p-5" style={{ position: 'relative' }}>
          <h2>Say Goodbye to High Medicine Prices</h2>
          <p>Compare Prices and Save up to 15%</p>
          <form onSubmit={handleSearchSubmit} className="d-flex justify-content-center align-items-center" style={{ position: 'relative' }}>
            <div className="dropdown me-2">
              <button
                className="btn btn-light dropdown-button"
                type="button"
                onClick={() => setPopupVisible(!popupVisible)}
              >
                Deliver to
              </button>
              {popupVisible && (
                <div className="popup-container" style={{
                  position: 'absolute',
                  top: '50px',
                  left: '0',
                  right: '0',
                  margin: 'auto',
                  backgroundColor: "white",
                  padding: '15px',
                  border: '1px solid #ccc',
                  borderRadius: '15px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  width: '300px',
                  zIndex: 10
                }}>
                  <h4>Select Delivery Location</h4>
                  <input
                    type="text"
                    placeholder="Enter PIN Code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="form-control mb-3"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handlePincodeSubmit();
                    }}
                    className="btn btn-primary mb-2"
                  >
                    Submit PIN Code
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurrentLocation();
                    }}
                    className="btn btn-secondary"
                  >
                    Use Current Location
                  </button>
                </div>
              )}
            </div>
            <input
              type="search"
              className="search-input"
              placeholder="Search for products"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
          {suggestions.length > 0 && searchQuery.trim().length > 0 && (
            <div className="suggestions-dropdown" style={{
              position: 'absolute',
              top: 'calc(100% + 5px)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '5px',
              width: '300px',
              maxHeight: '300px',
              overflowY: 'auto',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              {suggestions.map((suggestion, index) => {
                const product = productsData.find(p => p.name === suggestion);
                return (
                  <div 
                    key={index} 
                    className="suggestion-item" 
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{ 
                      padding: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'cover',
                        marginRight: '10px',
                        borderRadius: '4px'
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {product.category} • ₹{product.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {location && (
            <p className="current-location" style={{ marginTop: '15px' }}>
              Current Location: <strong>{location}</strong>
            </p>
          )}
        </div>

        {/* Place Order Section */}
        <div className="place">
          <h3 className="text-center mt-5">PLACE YOUR ORDER</h3>
          <div className="text-center mt-4 mb-5">
            <Link to={'/'} className="order-link mb-md-5">
              <Button><BiPhoneCall /> Call to place order</Button>
            </Link>
            <Link to={'/upload'} className="order-link">
              <Button><FaCloudUploadAlt /> Upload your prescription</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="slider">
        <div className="slides">
          <input type="radio" name="radio-btn" id="radio1" />
          <input type="radio" name="radio-btn" id="radio2" />
          <input type="radio" name="radio-btn" id="radio3" />
          <input type="radio" name="radio-btn" id="radio4" />

          <div className="slide first">
            <img src="/src/assets/banner5.avif" alt="1" />
          </div>
          <div className="slide second">
            <img src="/src/assets/banner3.avif" alt="2" />
          </div>
          <div className="slide third">
            <img src="/src/assets/banner4.avif" alt="3" />
          </div>
          <div className="slide four">
            <img src="/src/assets/banner1.jpg" alt="4" />
          </div>

          <div className="navigation-auto">
            <div className="auto-btn1"></div>
            <div className="auto-btn2"></div>
            <div className="auto-btn3"></div>
            <div className="auto-btn4"></div>
          </div>
        </div>
        <div className="navigation-manual">
          <label htmlFor="radio1" className="manual-btn"></label>
          <label htmlFor="radio2" className="manual-btn"></label>
          <label htmlFor="radio3" className="manual-btn"></label>
          <label htmlFor="radio4" className="manual-btn"></label>
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ backgroundColor: 'hsl(95, 76.00%, 95.10%)', padding: '10px', position: 'relative' }}>
        <div className="producthead">
          <h2>Our Featured Products</h2>
          <hr />
        </div>

        <div className="productss">
          {randomProducts.map((product) => (
            <div key={product.id} className="product">
              <div className="product-badge">
                {product.discount > 0 && (
                  <Badge bg="danger">-{product.discount}% OFF</Badge>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <Badge bg="warning">Low Stock</Badge>
                )}
                {product.stock === 0 && (
                  <Badge bg="secondary">Out of Stock</Badge>
                )}
              </div>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="text-muted small">{product.category}</p>
              <div className="mb-2">
                <StarRating  rating={product.rating} />
              </div>
              <div className="price-container">
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
                  <h5 className="text-primary">₹{product.price.toFixed(2)}</h5>
                )}
              </div>
              <Link to={`/productdetail/${product.id}`}>
                <button className="btn btn-primary mt-2">View Details</button>
              </Link>
              <button 
                className="btn btn-outline-secondary mt-2 ms-1"
                onClick={() => handleShowMore(product.category)}
              >
                Show More {product.category}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Offer Section */}
      <div style={{ backgroundColor: 'hsl(198, 76%, 95%)', padding: '10px' }}>
        <LimitedOffer/>
      </div>

      {/* Categories */}
      <div style={{ backgroundColor: 'hsl(95, 76.00%, 95.10%)', padding: '10px' }}>
        <div className="container mt-5">
          <div className="d-flex flex-column flex-md-row">
            {/* Sidebar */}
            <div className="sidebar me-2 mb-4 mb-md-0">
              <h2>Shop by Category</h2>
              <ul className="list-group mt-3">
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className={`list-group-item ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category)}
                    style={{
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: activeCategory === category ? 'hsl(199, 88.10%, 86.90%)' : 'white',
                    }}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div className="products flex-fill">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{activeCategory || 'All Products'}</h2>
                {activeCategory && (
                  <Button 
                    variant="outline-primary"
                    onClick={() => handleShowMore(activeCategory)}
                  >
                    View All {activeCategory}
                  </Button>
                )}
              </div>
              <div className="row row-cols-1 row-cols-sm-1 row-cols-lg-3 row-cols-md-2 g-4">
                {filteredProducts.slice(0, 6).map((product) => (
                  <div className="col" key={product.id}>
                    <Card className="h-100">
                      <div className="product-badge">
                        {product.discount > 0 && (
                          <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
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
                        style={{ height: '200px', objectFit: 'contain', padding: '1rem' }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>{product.name}</Card.Title>
                        <div className="mb-2">
                          <span className="text-muted small">{product.category}</span>
                        </div>
                        <div className="mb-2">
                          <StarRating rating={product.rating} />
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
                            <h5 className="text-primary">₹{product.price.toFixed(2)}</h5>
                          )}
                          <div className="d-grid gap-2 mt-3">
                            <Link 
                              to={`/productdetail/${product.id}`} 
                              className="btn btn-primary"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Items */}
      <div style={{ backgroundColor: 'hsl(198, 76%, 95%)', padding: '20px' }}>
      <ProductCarousel products={products} />
      </div>

      {/* Testimonials */}
      <div style={{ backgroundColor: 'hsl(95, 76.00%, 95.10%)', padding: '10px' }}>
        <div className="testimonials-section">
          <h2>What Our Customers Have to Say</h2>
          <hr className="testimonials-underline" />
          <div className="scroll-container">
            {showLeftButton && (
              <button className="scroll-btn left-btn" onClick={() => smoothScroll(-1)}>
                &lt;
              </button>
            )}
            <div 
              className="scroll-content" 
              id="testimonials-container" 
              onScroll={handleScroll}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial">
                  <p className="testimonial-highlight">
                    <strong>{testimonial.highlight}</strong>
                  </p>
                  <p className="testimonial-message">{testimonial.message}</p>
                  <h4 className="testimonial-author">- {testimonial.author}</h4>
                </div>
              ))}
            </div>
            <button className="scroll-btn right-btn" onClick={() => smoothScroll(1)}>
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ backgroundColor: 'hsl(198, 76%, 95%)', padding: '10px' }}>
        <div className="producthead">
          <h2>FAQ</h2>
          <hr />
          <ul className="accordion">
            {faqs.map((faq, index) => (
              <li key={index}>
                <div className="details">
                  <div className="summary" onClick={() => toggleFAQ(index)}>
                    {faq.question}
                  </div>
                  <p
                    className="contents"
                    style={{
                      height: openIndex === index ? "auto" : "0",
                      overflow: "hidden",
                      transition: "height 0.3s ease",
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;