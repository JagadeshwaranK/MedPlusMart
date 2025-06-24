import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import productsData from '../components/Product/ProductData'; // Import product data

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState(productsData); // Initialize with local product data
  const [newProduct, setNewProduct] = useState({
    image: null, 
    name: '',
    description: '',
    stock: 0,
    uses: '',
    price: 0,
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch users from your API
    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setNewProduct((prev) => ({
      ...prev,
      image: e.target.files[0], 
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', newProduct.image);
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('stock', newProduct.stock);
    formData.append('uses', newProduct.uses);
    formData.append('price', newProduct.price);

    // Simulate adding product to local state
    const addedProduct = {
      id: products.length + 1, // Simple ID generation
      ...newProduct,
    };
    setProducts((prev) => [...prev, addedProduct]);
    setNewProduct({
      image: null,
      name: '',
      description: '',
      stock: 0,
      uses: '',
      price: 0,
    });
  };

  // Local storage handling for products and orders
  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const loadFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  };

  // Use local storage for orders
  useEffect(() => {
    const storedOrders = loadFromLocalStorage('orders');
    setOrders(storedOrders);
  }, []);

  useEffect(() => {
    saveToLocalStorage('orders', orders);
  }, [orders]);

  return (
    <div className="container mt-5">
      <div className="text-center">
      <h2 className='mb-4'>Admin Dashboard</h2>
      
      </div>
      <h3>Users Information</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Add New Product</h3>
      <Form onSubmit={handleAddProduct}>
        <Form.Group controlId="formImage">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={handleImageChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formStock">
          <Form.Label>Stock Limit</Form.Label>
          <Form.Control
            type="number"
            name="stock"
            value={newProduct.stock}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formUses">
          <Form.Label>Uses</Form.Label>
          <Form.Control
            type="text"
            name="uses"
            value={newProduct.uses}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Button variant="primary" className='mt-3 mb-2' type="submit">
          Add Product
        </Button>
      </Form>

      <h3>Orders List</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Product ID</th>
            <th>Quantity Sold</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.userId}</td>
              <td>{order.productId}</td>
              <td>{order.quantity}</td>
              <td>₹{order.totalPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminDashboard;
