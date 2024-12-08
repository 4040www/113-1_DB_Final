import React, { useEffect, useState } from 'react';

export default function YourOrder() {
  const [orders, setOrders] = useState([]);
  const [comments, setComments] = useState({}); // Store comments per order

  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem('role'); // Assume userId is stored in localStorage
      if (!userId) throw new Error("User ID not found");

      const response = await fetch(`http://localhost:${window.globalPort}/get_order?userid=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      console.log('Fetched orders:', data.data); // Debug log

      if (data.status === 'success' && Array.isArray(data.data)) {
        setOrders(data.data); // Update order data
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]); // Clear order data on error
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleInputChange = (orderId, value) => {
    setComments((prev) => ({
      ...prev,
      [orderId]: value,
    }));
  };

  const handleRefund = async (orderId, behavior) => {
    try {
      const response = await fetch(`http://localhost:${window.globalPort}/refund_request?orderId=${orderId}&behavior=${behavior}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to refund order');

      alert('Sending order refund request...');
      fetchOrders();
    } catch (err) {
      console.error('Error refunding order:', err);
      alert('Failed to refund order. Please try again.');
    }
  };

  const handleReview = async (orderId) => {
    const comment = comments[orderId];
    if (!orderId || !comment) {
      alert('Please enter a valid comment');
      return;
    }
    try {
      const response = await fetch(`http://localhost:${window.globalPort}/add_comment?orderId=${orderId}&comment=${comment}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to add comment');

      alert('Comment added successfully!');
      setComments((prev) => ({
        ...prev,
        [orderId]: '', // Clear comment after adding
      }));
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    }
  };

  const truncate = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div>
      <h1>Your Orders</h1>
      <div className="YourOrderCard">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.orderid} className="YourOrderCard-content">
              <div className="YourOrderCard-info">
                <h3>
                  {order.orderid} - ${order.amount.toFixed(2)}
                </h3>
                <div>Status: {order.state}</div>
                <div>Purchase Date: {new Date(order.otime).toLocaleDateString()}</div>
                <input
                  type="text"
                  placeholder="Enter your comment"
                  value={comments[order.orderid] || ''}
                  onChange={(e) => handleInputChange(order.orderid, e.target.value)}
                />
                <div className="YourOrderCard-content-button">
                  <button
                    onClick={() => handleRefund(order.orderid, order.state == 'Confirm' ? 'Processing' : 'Confirm')}
                  >{order.state == 'Confirm' ? 'Refund' : 'Cancel Refund'}</button>
                  <button onClick={() => handleReview(order.orderid)}>Review</button>
                </div>
              </div>
              <div className="YourProductCardinOrder">
                {order.products && order.products.length > 0 ? (
                  order.products.map((product) => (
                    <div key={product.productid} className="YourProductCardinOrder-content">
                      <h3 title={product.product_name} style={{ cursor: 'pointer' }}>
                        {truncate(product.product_name, 10)}
                      </h3>
                      ${product.price.toFixed(2)}
                      <div>Amount: {product.quantity}</div>
                    </div>
                  ))
                ) : (
                  <div>No products found</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No orders found</div>
        )}
      </div>
    </div>
  );
}
