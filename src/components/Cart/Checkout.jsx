import React, { useState } from 'react';
import { Card, Form, Button, Container, Row, Col, ListGroup, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    upiId: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isShippingComplete, setIsShippingComplete] = useState(false);
  const [isSummaryComplete, setIsSummaryComplete] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleQuantityChange = (id, increment) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(item.quantity + increment, 1) } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (currentStep === 1) {
      setIsShippingComplete(true);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setIsSummaryComplete(true);
      setCurrentStep(3);
    } else if (currentStep === 3) {
     
      if (formData.paymentMethod === 'creditCard' && (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVC)) {
        alert('Please fill in all credit card details.');
        return;
      }
      if (formData.paymentMethod === 'upi' && !formData.upiId) {
        alert('Please enter your UPI ID.');
        return;
      }
     
      setShowSuccessModal(true);
      
      resetFormAndCart();
    }
  };

  const resetFormAndCart = () => {
    setFormData({
      name: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      paymentMethod: '',
      cardNumber: '',
      cardExpiry: '',
      cardCVC: '',
      upiId: '',
    });
    setCartItems([]);
    setCurrentStep(1); 
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <Container className="mt-5">
      <h2>Checkout</h2>
      <Row>
        {/* STEP 1: Checkout Form */}
        <Col md={6} className="checkout-form">
          <Card className="mb-3">
            <Card.Header className={isShippingComplete ? 'header-complete' : 'header-incomplete'}>
              <div className="d-flex justify-content-between">
                <h5>Delivery Address</h5>
                {isShippingComplete && <span className="text-success">✔</span>}
              </div>
            </Card.Header>
            {currentStep === 1 && (
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text"
                      placeholder="Enter your name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formState">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formZip">
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your zip code"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-3">
                    Continue
                  </Button>
                </Form>
              </Card.Body>
            )}
            {isShippingComplete && currentStep !== 1 && (
              <Card.Body>
                <p>
                  <strong>Name:</strong> {formData.name} | 
                  <strong>Email:</strong> {formData.email} | 
                  <strong>Address:</strong> {formData.address}, {formData.city}, {formData.state}, {formData.zip}
                </p>  
                <Button onClick={() => setCurrentStep(1)}> Edit</Button> 
              </Card.Body>
            )}
          </Card>

          {/* STEP 2: Product Summary Section */}
          <Card className="mb-3">
            <Card.Header className={isSummaryComplete ? 'header-complete' : 'header-incomplete'}>
              <div className="d-flex justify-content-between">
                <h5>Order Summary</h5>
                {isSummaryComplete && <span className="text-success">✔️</span>}
              </div>
            </Card.Header>

            {currentStep === 2 && (
              <Card.Body>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                      <img src={`/images/${item.image}`} alt={item.name} style={{ width: '100px', height: '100px' }} />
                      <div className="flex-grow-1 mx-2">
                        <h6>{item.name}</h6>
                        <ListGroup.Item key={item.id}>
                             {item.name} x {item.quantity}: ₹{parseFloat(item.price).toFixed(2)}
                        </ListGroup.Item>
                      </div>
                      <div>
                        <Button variant="outline-secondary" onClick={() => handleQuantityChange(item.id, -1)}>-</Button>
                        <Button variant="outline-secondary" onClick={() => handleQuantityChange(item.id, 1)}>+</Button>
                        <Button variant="danger" onClick={() => handleRemoveItem(item.id)}>Remove</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-danger">Your cart is empty. Please add items to proceed.</p>
                )}
                <Button
                  variant="primary"
                  onClick={() => {
                    if (cartItems.length > 0) {
                      setIsSummaryComplete(true);
                      setCurrentStep(3);
                    } else {
                      alert('Your cart is empty. Add items before proceeding!');
                    }
                  }}
                >
                  Continue
                </Button>
              </Card.Body>
            )}

            {isShippingComplete && currentStep !== 2 && (
              <Card.Body>
                <div>
                  <p>
                    <strong>Total Quantity:</strong> {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </p>
                </div>
                <Button onClick={() => setCurrentStep(2)}> Edit</Button> 
              </Card.Body>
            )}
          </Card>       

          {/* STEP 3: Payment Information Section */}
          <Card className="mb-3">
            <Card.Header>
              <h5>Payment Option</h5>
            </Card.Header>
            {currentStep === 3 && (
              <Card.Body>
                <Form.Group controlId="formPaymentMethod" required>
                  <Form.Label>Select Payment Method</Form.Label>
                  <Form.Control as="select" name="paymentMethod" onChange={handleChange} required>
                    <option value="">Choose...</option>
                    <option value="upi">UPI</option>
                    <option value="creditCard">Credit/Debit Card</option>
                    <option value="cashOnDelivery">Cash on Delivery</option>
                  </Form.Control>
                </Form.Group>

                {formData.paymentMethod === 'creditCard' && (
                  <>
                    <Form.Group controlId="formCardNumber">
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your card number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formCardExpiry">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="MM/YY"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formCardCVC">
                      <Form.Label>CVC</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your CVC"
                        name="cardCVC"
                        value={formData.cardCVC}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </>
                )}

                {formData.paymentMethod === 'upi' && (
                  <Form.Group controlId="formUpiId">
                    <Form.Label>UPI ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your UPI ID"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                )}

                {formData.paymentMethod && (
                  <Button variant="primary" onClick={handleSubmit} className="mt-3">
                    Place Order
                  </Button>
                )}
 </Card.Body>
            )}
          </Card>
        </Col>

        {/* Order Details */}
        <Col md={4} className="order-details">
          <h5>Order Details</h5>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Price Details</Card.Title>
              <ListGroup className="list-group-flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.id}>
                    {item.name} x {item.quantity}: ₹{(item.price * item.quantity).toFixed(2)}
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>Delivery Charges: FREE</ListGroup.Item>
                <ListGroup.Item>Packaging Charge: ₹5.00</ListGroup.Item>
                <ListGroup.Item>Protect Promise Fee: ₹3.00</ListGroup.Item>
                <ListGroup.Item>
                  Total Payable: ₹{(cartItems.reduce((total, item) => total + item.price * item.quantity, 0) + 8.00).toFixed(2)}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Order Placed Successfully!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <img src='/src/assets/ordered.gif' alt="Order Placed" style={{ width: '300px', height: '300px' }} />
            <p>Your order has been placed successfully.</p>
            <p>Thank you for shopping with us!</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Checkout;