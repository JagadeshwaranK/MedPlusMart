import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Form, Button, Offcanvas, Badge } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../pages/SearchBar'; 
import productsData from '../components/Product/ProductData';
import '../styles/navbar.css';

const Navbars = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInHeader, setShowSearchInHeader] = useState(false);
  const [cartItems, setCartItems] = useState(0); 
  const [suggestions, setSuggestions] = useState([]);
  // Removed unused variable 'isAuthPage' to fix the compile error
  const categories = ['/productlist', '/productdetail', '/cart'];

  useEffect(() => {
    // Check authentication on each render
    setIsAuthenticated(localStorage.getItem('isLoggedIn') === 'true');

    // Load cart items from local storage
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems.length); 

    // Add scroll listener to toggle search bar visibility
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowSearchInHeader(true);
      } else {
        setShowSearchInHeader(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Fetch suggestions from productData based on the query
    if (query) {
      const fetchedSuggestions = productsData
        .filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => {
          // Prioritize matches at the start of the name
          const aStartsWith = a.name.toLowerCase().startsWith(query.toLowerCase());
          const bStartsWith = b.name.toLowerCase().startsWith(query.toLowerCase());
          
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return a.name.localeCompare(b.name);
        })
        .slice(0, 5) // Limit to 5 suggestions
        .map(product => ({
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          id: product.id
        }));
      
      setSuggestions(fetchedSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setSuggestions([]);
    navigate(`/productdetail/${suggestion.id}`);
  };

  return (
    <>
      {showSearchInHeader && (
        <div
          className="header-search"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            backgroundColor: '#f8f9fa',
            zIndex: 1000,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '10px',
            textAlign: 'center',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <Container className="d-flex justify-content-between align-items-center">
            <Navbar.Brand as={Link} to="/" style={{ 
              fontWeight: 'bold', 
              fontSize: '25px', 
              color: '#2a6496',
              fontFamily: '"Arial Rounded MT Bold", sans-serif'
            }}>
            <img src="src/assets/logo.jpeg" alt="#" style={{width:'40px'}} />
              <span style={{ color: '#4CAF50' }}>Medi</span>
              <span style={{ color: '#2196F3' }}>Mart</span>
            </Navbar.Brand>
            <Form className="d-flex flex-grow-1 justify-content-center" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Search medicines, health products..."
                className="me-2"
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  padding: '10px 20px',
                  width: '400px',
                  borderRadius: '25px',
                  border: '2px solid #4CAF50',
                  fontSize: '16px'
                }}
              />
              <Button 
                variant="success" 
                type="submit" 
                style={{ 
                  padding: '10px 20px', 
                  borderRadius: '25px',
                  fontWeight: 'bold'
                }}
              >
                Search
              </Button>
            </Form>
            <Link to="/cart" style={{ textDecoration: 'none', color: '#000', position: 'relative' }}>
              <span style={{ fontSize: '24px' }}>🛒</span> 
              {cartItems > 0 && (
                <Badge 
                  bg="danger" 
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    fontSize: '12px',
                    padding: '5px 8px',
                    borderRadius: '50%'
                  }}
                >
                  {cartItems}
                </Badge>
              )}
            </Link>
          </Container>
          {suggestions.length > 0 && (
            <div 
              className="suggestions-dropdown" 
              style={{ 
                position: 'absolute', 
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000, 
                backgroundColor: 'white', 
                border: '1px solid #ddd',
                borderRadius: '0 0 10px 10px',
                width: '400px',
                maxHeight: '400px',
                overflowY: 'auto',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="suggestion-item" 
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{ 
                    padding: '12px 15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #eee',
                    transition: 'background-color 0.2s',
                    ':hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <img 
                    src={suggestion.image} 
                    alt={suggestion.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain',
                      marginRight: '15px',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#333' }}>{suggestion.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {suggestion.category} • ₹{suggestion.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Navbar */}
      <Navbar expand="lg" className="navbar navhead d-none d-lg-flex" style={{ backgroundColor: '#cffae0' }}>
        <Container>
          <Navbar.Brand className="navhome fs-4" as={Link} to="/" style={{ 
            color: '#2a6496',
            fontFamily: '"Arial Rounded MT Bold", sans-serif'
          }}>
            <span style={{ color: '#4CAF50' }}>Medi</span>
            <span style={{ color: '#2196F3' }}>Mart</span>
          </Navbar.Brand>
          {categories.includes(location.pathname) && (
            <SearchBar onSearch={handleSearchSubmit} /> 
          )}
          <div className="d-flex align-items-center">
            {!isAuthenticated ? (
              <>
                <Link to="/login"><Button variant="outline-dark" className="me-2">Login/Signup</Button></Link>
                {/* <Link to="/signup"><Button variant="outline-dark" className="me-2">Signup</Button></Link> */}
              </>
            ) : (
              <>
                <Link to="/profile">
                  <Button variant="outline-secondary" className="me-3" style={{ borderRadius: '20px' }}>
                    My Account
                  </Button>
                </Link>
                <Button 
                  variant="outline-danger" 
                  className="me-3" 
                  onClick={handleLogout}
                  style={{ borderRadius: '20px' }}
                >
                  Logout
                </Button>
                <Link to="/cart" style={{ textDecoration: 'none', position: 'relative' }}>
                  <Button variant="outline-success" style={{ borderRadius: '20px' }}>
                    <span style={{ marginRight: '5px' }}>Cart</span>
                    {cartItems > 0 && (
                      <Badge bg="danger" style={{ 
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        fontSize: '12px',
                        padding: '4px 6px',
                        borderRadius: '50%'
                      }}>
                        {cartItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </Container>
      </Navbar>

      {/* Mobile Navbar */}
      <Navbar expand="lg" className="navbar navhead d-lg-none" style={{ backgroundColor: '#cffae0' }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-white" style={{ fontFamily: '"Arial Rounded MT Bold", sans-serif' }}>
            <span style={{ fontWeight: 'bold' }}>MediMart</span>
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <Link to="/cart" style={{ textDecoration: 'none', color: 'white', position: 'relative', marginRight: '15px' }}>
              <span style={{ fontSize: '20px' }}>🛒</span>
              {cartItems > 0 && (
                <Badge 
                  bg="danger" 
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    fontSize: '10px',
                    padding: '4px 6px',
                    borderRadius: '50%'
                  }}
                >
                  {cartItems}
                </Badge>
              )}
            </Link>
            <Button 
              variant="link" 
              className="text-white" 
              onClick={() => setShowMenu(true)} 
              style={{ textDecoration: 'none', padding: '5px' }}
            >
              <span style={{ fontSize: '24px' }}>☰</span>
            </Button>
          </div>
        </Container>
      </Navbar>

      <hr className="hr" />

      <Nav className="justify-content-center navbar navitem d-none d-lg-flex" style={{ backgroundColor: '#cffae0' }}>
        <Nav.Item>
          <Nav.Link 
            as={Link} 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
            style={{ 
              fontWeight: '500',
              padding: '15px 20px',
              color: location.pathname === '/' ? '#4CAF50' : '#555'
            }}
          >
            Home
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            as={Link} 
            to="/productlist" 
            className={location.pathname === '/productlist' ? 'active' : ''}
            style={{ 
              fontWeight: '500',
              padding: '15px 20px',
              color: location.pathname === '/productlist' ? '#4CAF50' : '#555'
            }}
          >
            Products
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            as={Link} 
            to="/offers" 
            className={location.pathname === '/offers' ? 'active' : ''}
            style={{ 
              fontWeight: '500',
              padding: '15px 20px',
              color: location.pathname === '/offers' ? '#4CAF50' : '#555'
            }}
          >
            Special Offers
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            as={Link} 
            to="/healthcare" 
            className={location.pathname === '/healthcare' ? 'active' : ''}
            style={{ 
              fontWeight: '500',
              padding: '15px 20px',
              color: location.pathname === '/healthcare' ? '#4CAF50' : '#555'
            }}
          >
            Healthcare
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Offcanvas 
        show={showMenu} 
        onHide={() => setShowMenu(false)} 
        placement="end" 
        style={{ backgroundColor: '#4CAF50', color: 'white' }}
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title style={{ fontFamily: '"Arial Rounded MT Bold", sans-serif' }}>
            MediMart Menu
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="text-center">
          <Nav className="flex-column mb-4">
            <Nav.Link 
              as={Link} 
              to="/" 
              className="text-white py-3" 
              onClick={() => setShowMenu(false)}
              style={{ 
                fontSize: '18px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/productlist" 
              className="text-white py-3" 
              onClick={() => setShowMenu(false)}
              style={{ 
                fontSize: '18px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              Products
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/offers" 
              className="text-white py-3" 
              onClick={() => setShowMenu(false)}
              style={{ 
                fontSize: '18px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              Special Offers
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/healthcare" 
              className="text-white py-3" 
              onClick={() => setShowMenu(false)}
              style={{ 
                fontSize: '18px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              Healthcare
            </Nav.Link>
          </Nav>
          
          <div className="mt-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button 
                    variant="outline-light" 
                    className="w-100 mb-3 py-2"
                    onClick={() => setShowMenu(false)}
                    style={{ borderRadius: '25px' }}
                  >
                    Login / Signup
                  </Button>
                </Link>
              
              </>
            ) : (
              <>
                <Link to="/profile">
                  <Button 
                    variant="outline-light" 
                    className="w-100 mb-3 py-2"
                    onClick={() => setShowMenu(false)}
                    style={{ borderRadius: '25px' }}
                  >
                    My Profile
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button 
                    variant="light" 
                    className="w-100 mb-3 py-2"
                    onClick={() => setShowMenu(false)}
                    style={{ 
                      borderRadius: '25px',
                      color: '#4CAF50',
                      fontWeight: 'bold',
                      position: 'relative'
                    }}
                  >
                    My Cart
                    {cartItems > 0 && (
                      <Badge 
                        bg="danger" 
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          fontSize: '12px',
                          padding: '4px 6px',
                          borderRadius: '50%'
                        }}
                      >
                        {cartItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Button 
                  variant="outline-light" 
                  className="w-100 py-2"
                  onClick={() => {
                    handleLogout();
                    setShowMenu(false);
                  }}
                  style={{ borderRadius: '25px' }}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Navbars;