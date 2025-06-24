import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProductList from "./components/Product/ProductList";
import ProductDetail from "./components/Product/ProductDetail";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Cart/Checkout";
import OrderHistory from "./components/Orders/OrderHistory";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ForgetPassword from "./components/Auth/ForgetPassword";
import Navbars from "./components/Navbar";
import Footer from "./components/Footer";
import Search from './pages/Search';
import Upload from './pages/Upload';
import ScrollToTop from './components/Product/ScrollToTop.jsx'; 
import Healthcare from './components/Product/Healthcare.jsx';
import SpecialOffer from './components/Product/SpecialOffer.jsx';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Router>
      <ScrollToTop />
      <Navbars cartItems={cartItems} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/productlist" 
          element={<ProductList addToCart={addToCart} />} 
        />
         <Route 
          path="/healthcare" 
          element={<Healthcare addToCart={addToCart} />} 
        />
           <Route 
          path="/offers" 
          element={<SpecialOffer addToCart={addToCart} />} 
        />
        <Route 
          path="/productdetail/:id" 
          element={<ProductDetail addToCart={addToCart} />} 
        />
        <Route path="/search" element={<Search />} />
        <Route 
          path="/cart" 
          element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />} 
        />
        <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/forget" element={<ForgetPassword />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;