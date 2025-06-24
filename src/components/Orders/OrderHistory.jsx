import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/${userId}`); 
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  return (
    <div className="container mx-auto my-8 p-4 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Order History</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders placed yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Product ID</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Order Date</th>
              <th className="p-2 border">Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="text-center hover:bg-gray-100">
                <td className="p-2 border">{order.name}</td>
                <td className="p-2 border">{order.productId}</td>
                <td className="p-2 border">{order.category}</td>
                <td className="p-2 border">{order.quantity}</td>
                <td className="p-2 border">{order.orderDate}</td>
                <td className="p-2 border">₹{order.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
