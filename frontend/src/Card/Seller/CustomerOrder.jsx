import '../Card.css';
import React, { useState } from 'react';

export default function CustomerOrder({ order_data, fetchOrderData }) {
    const [statusFilter, setStatusFilter] = useState('All');

    // Handle changing the status filter
    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    // Filter orders by selected status
    const filteredOrders = statusFilter === 'All'
        ? order_data
        : order_data.filter((order) => order.state === statusFilter);

    const handleChangeOrderState = async (orderId, behavior) => {
        try {
          const response = await fetch(`http://localhost:${window.globalPort}/change_order_state?orderId=${orderId}&behavior=${behavior}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) throw new Error('Failed to refund order');
    
          alert('Sending order state change request...');
          fetchOrderData();
        } catch (err) {
          console.error('Error refunding order:', err);
          alert('Failed to refund order. Please try again.');
        }
      };

    return (
        <div className='MarketCard'>
            <h2>Customer Order</h2>
            <select value={statusFilter} onChange={handleStatusChange}>
                <option value="All">All</option>
                <option value="Waiting">Waiting</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Finished">Finished</option>
                <option value="CheckCancel">Check Cancel</option>
                <option value="Canceled">Canceled</option>
            </select>
            <div className='CustomerOrderCard'>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div key={order.orderid} className="CustomerOrderCard-content">
                            <div>
                                <h3>From {order.buyer_name} - ${order.amount}</h3>
                                <div>Purchase Date: {new Date(order.otime).toLocaleDateString()}</div>
                                <div>Status: {order.state}</div>
                                <div>Method: {order.method}</div>
                                <div>review: {order.review}</div>
                            </div>
                            <div className='CustomerOrderCard-content-button'>
                                {order.state === 'Waiting' && (
                                    <>
                                        <button
                                            onClick={() => handleChangeOrderState(order.orderid, 'Confirmed')}
                                        >Confirm</button>
                                        <button
                                            onClick={() => handleChangeOrderState(order.orderid, 'Canceled')}
                                        >Cancel</button>
                                    </>
                                )}
                                {(order.state === 'Confirmed' || order.state === 'Processing') && (
                                    <button
                                        onClick={() => handleChangeOrderState(order.orderid, 'Canceled')}
                                    >Cancel</button>
                                )}
                                {order.state === 'CancelWaiting' && (
                                    <button
                                        onClick={() => handleChangeOrderState(order.orderid, 'Finished')}
                                    >Finish</button>
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
