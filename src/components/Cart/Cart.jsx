import React from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cartItems, removeFromCart }) => {
  const navigate = useNavigate();
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Container className="mt-5">
      <h2>Your Cart</h2>
      <ListGroup>
        {cartItems.length === 0 ? (
          <ListGroup.Item>Your cart is empty.</ListGroup.Item>
        ) : (
          cartItems.map((item) => (
            <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{ width: '50px', height: '50px', marginRight: '10px' }} 
                />
                <span>{item.name} (x{item.quantity}): ₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <Button variant="danger" onClick={() => removeFromCart(item.id)}>Remove</Button>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
      {cartItems.length > 0 && (
        <div className="mt-3">
          <h4>Total Amount: ₹{totalAmount.toFixed(2)}</h4>
          <Button className='mb-md-4 mt-md-3'   variant="success" onClick={() => navigate('/checkout', { state: { cartItems } })}>Proceed to Checkout</Button>
        </div>
      )}
    </Container>
  );
};

export default Cart;