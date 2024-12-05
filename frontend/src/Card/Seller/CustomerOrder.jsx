import '../Card.css';
import React from 'react';

const orders = [
    { name: 'Billy', amount: '$1000', date: '2024 / 10 / 25', status: 'Delivering' },
    { name: 'Sally', amount: '$1500', date: '2024 / 11 / 01', status: 'Pending' },
    { name: 'John', amount: '$2000', date: '2024 / 09 / 15', status: 'Completed' },
    { name: 'Jane', amount: '$2500', date: '2024 / 08 / 20', status: 'Cancelled' },
    { name: 'Tom', amount: '$3000', date: '2024 / 07 / 30', status: 'Delivering' },
    { name: 'Lucy', amount: '$3500', date: '2024 / 06 / 10', status: 'Pending' }
];

export default function CustomerOrder() {
    return (
        <div className='MarketCard'>
            <h2>Customer Order</h2>
            <select>
                <option>Delivering</option>
                <option>Pending</option>
                <option>Completed</option>
                <option>Cancelled</option>
            </select>
            <div className='CustomerOrderCard'>
                {orders.map((order, index) => (
                    <div key={index} className="CustomerOrderCard-content">
                        <div>
                            <h3>{order.name} {order.amount}</h3>
                            <div>Purchase Date : {order.date}</div>
                            <div>Status : {order.status}</div>
                        </div>
                        <div className='CustomerOrderCard-content-button'>
                            <button>Cancel Order</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
