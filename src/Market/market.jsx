import React from 'react';
import { useNavigate } from 'react-router-dom';
import Product_card from './product_card';

const Market_data = [
    { id: 1, pname: 'Jackfruit', price: 100, storage: 110, period: 120, size: 130, color: 'yellow' },
    { id: 2, pname: 'Ice cream', price: 90, storage: 100, period: 110, size: 120, color: 'red' },
    { id: 3, pname: 'Honeydew', price: 80, storage: 90, period: 100, size: 110, color: 'yellow' },
    { id: 4, pname: 'Grape', price: 70, storage: 80, period: 90, size: 100, color: 'red' },
    { id: 5, pname: 'Fig', price: 60, storage: 70, period: 80, size: 90, color: 'yellow' },
    { id: 6, pname: 'Elderberry', price: 50, storage: 60, period: 70, size: 80, color: 'red' },
    { id: 7, pname: 'Durian', price: 40, storage: 50, period: 60, size: 70, color: 'yellow' },
    { id: 8, pname: 'Cherry', price: 30, storage: 40, period: 50, size: 60, color: 'red' },
    { id: 9, pname: 'Banana', price: 20, storage: 30, period: 40, size: 50, color: 'yellow' },
    { id: 10, pname: 'Apple', price: 10, storage: 20, period: 30, size: 40, color: 'red' },
];

export default function Market() {
    const navigate = useNavigate();

    return (
        <div className="Shop">
            <h2>My Market</h2>
            <div className='product_list'>
                {Market_data.map((product) => {
                    return (
                        <Product_card product={product} />
                    );
                })}
            </div>
            <div className='Nav-button-Shop'>
                <button className='nav-button' onClick={() => navigate('/cart')}>Your Cart</button>
                <button className='nav-button' onClick={() => navigate('/shop')}>Shop</button>
                <button className='nav-button' onClick={() => navigate('/')}>Log Out</button>
            </div>
        </div>
    );
}