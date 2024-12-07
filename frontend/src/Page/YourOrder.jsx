import React, { useEffect, useState } from 'react';

export default function YourOrder() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem('role'); // 假設 userId 存儲在 localStorage
        if (!userId) throw new Error("User ID not found");

        const response = await fetch(`http://localhost:5000/get_order?userid=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();
        console.log('Fetched orders:', data.data); // Debug 日誌

        // 確保返回的資料格式是預期的
        if (data.status === 'success' && Array.isArray(data.data)) {
          setOrders(data.data); // 更新訂單資料
        } else {
          throw new Error('Unexpected response structure');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]); // 如果發生錯誤，清空訂單數據
      }
    };

    fetchOrders();
  }, []);


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
                <h3>{order.orderid} - ${order.amount.toFixed(2)}</h3>
                <div>Status: {order.state}</div>
                <div>Purchase Date: {new Date(order.otime).toLocaleDateString()}</div>
                <div className="YourOrderCard-content-button">
                  <button>{order.state !== 'Checking' ? 'Refund' : 'Cancel'}</button>
                  <button>Feedback</button>
                </div>
              </div>
              <div className="YourProductCardinOrder">
                {order.products && order.products.length > 0 ? (
                  order.products.map((product) => (
                    <div key={product.productid} className="YourProductCardinOrder-content">
                      <h3
                        title={product.product_name}
                        style={{ cursor: 'pointer' }}
                      >
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
