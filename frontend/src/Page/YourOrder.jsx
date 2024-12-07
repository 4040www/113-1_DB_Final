import React, { useEffect, useState } from 'react';

export default function YourOrder() {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem('role'); // Assuming user ID is stored in localStorage
        const response = await fetch(`http://localhost:5000/get_order?userid=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        console.log('Fetched orders:', data); // Debugging line
        setOrders(data.data);  // Update to handle data correctly
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Your Orders</h1>
      <div className='YourOrderCard'>
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="YourOrderCard-content">
              <div className="YourOrderCard-info">
                <h3>{order.marketName} - ${order.totalPrice.toFixed(2)}</h3>
                <div>Status: {order.status}</div>
                <div>Purchase Date: {order.purchaseDate}</div>
                <div className='YourOrderCard-content-button'>
                  <button>{order.status !== 'Checking' ? 'Refund' : 'Cancel'}</button>
                  <button>Feedback</button>
                </div>
              </div>
              <div className='YourProductCardinOrder'>
                {order.products.map((product) => (
                  <div key={product.id} className="YourProductCardinOrder-content">
                    <h3>{product.name} - ${product.price.toFixed(2)}</h3>
                    <div>Amount: {product.amount}</div>
                  </div>
                ))}
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
