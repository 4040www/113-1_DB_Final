import React from 'react';
import { useNavigate } from 'react-router-dom';
import Product_card from './product_card';


const Cart_data = [
    { id: 1, pname: 'Durian', price: 40, storage: 50, period: 60, size: 70, color: 'yellow' },
    { id: 2, pname: 'Elderberry', price: 50, storage: 60, period: 70, size: 80, color: 'red' },
    { id: 3, pname: 'Fig', price: 60, storage: 70, period: 80, size: 90, color: 'yellow' },
    { id: 4, pname: 'Peach', price: 160, storage: 170, period: 180, size: 190, color: 'yellow' },
    { id: 5, pname: 'Watermelon', price: 230, storage: 240, period: 250, size: 260, color: 'red' },
    { id: 6, pname: 'Xigua', price: 240, storage: 250, period: 260, size: 270, color: 'yellow' },
    { id: 7, pname: 'Yuzu', price: 250, storage: 260, period: 270, size: 280, color: 'red' },
    { id: 8, pname: 'Zucchini', price: 260, storage: 270, period: 280, size: 290, color: 'yellow' }
];

export default function Cart() {
    const navigate = useNavigate();
    return (
        <div className="Shop">
            <h2>Cart</h2>
            <div className='product_list'>
                {Cart_data.map((product) => {
                    return (
                        <Product_card product={product} />
                    );
                })}
            </div>
            <div className='Nav-button-Shop'>
                <button className='nav-button' onClick={() => navigate('/your_market')}>Your Market</button>
                <button className='nav-button' onClick={() => navigate('/shop')}>Shop</button>
                <button className='nav-button' onClick={() => navigate('/')}>Log Out</button>
            </div>
        </div>
    );
}