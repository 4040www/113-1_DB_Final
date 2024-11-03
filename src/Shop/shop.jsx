import React from 'react';
import { useNavigate } from 'react-router-dom';
import Product_card from './product_card';

// pname, price, storage, period, size, color
const Product_data = [
    { id: 1, pname: 'Apple', price: 10, storage: 20, period: 30, size: 40, color: 'red' },
    { id: 2, pname: 'Banana', price: 20, storage: 30, period: 40, size: 50, color: 'yellow' },
    { id: 3, pname: 'Cherry', price: 30, storage: 40, period: 50, size: 60, color: 'red' },
    { id: 4, pname: 'Durian', price: 40, storage: 50, period: 60, size: 70, color: 'yellow' },
    { id: 5, pname: 'Elderberry', price: 50, storage: 60, period: 70, size: 80, color: 'red' },
    { id: 6, pname: 'Fig', price: 60, storage: 70, period: 80, size: 90, color: 'yellow' },
    { id: 7, pname: 'Grape', price: 70, storage: 80, period: 90, size: 100, color: 'red' },
    { id: 8, pname: 'Honeydew', price: 80, storage: 90, period: 100, size: 110, color: 'yellow' },
    { id: 9, pname: 'Ice cream', price: 90, storage: 100, period: 110, size: 120, color: 'red' },
    { id: 10, pname: 'Jackfruit', price: 100, storage: 110, period: 120, size: 130, color: 'yellow' },
    { id: 11, pname: 'Kiwi', price: 110, storage: 120, period: 130, size: 140, color: 'red' },
    { id: 12, pname: 'Lemon', price: 120, storage: 130, period: 140, size: 150, color: 'yellow' },
    { id: 13, pname: 'Mango', price: 130, storage: 140, period: 150, size: 160, color: 'red' },
    { id: 14, pname: 'Nectarine', price: 140, storage: 150, period: 160, size: 170, color: 'yellow' },
    { id: 15, pname: 'Orange', price: 150, storage: 160, period: 170, size: 180, color: 'red' },
    { id: 16, pname: 'Peach', price: 160, storage: 170, period: 180, size: 190, color: 'yellow' },
    { id: 17, pname: 'Quince', price: 170, storage: 180, period: 190, size: 200, color: 'red' },
    { id: 18, pname: 'Raspberry', price: 180, storage: 190, period: 200, size: 210, color: 'yellow' },
    { id: 19, pname: 'Strawberry', price: 190, storage: 200, period: 210, size: 220, color: 'red' },
    { id: 20, pname: 'Tomato', price: 200, storage: 210, period: 220, size: 230, color: 'yellow' },
    { id: 21, pname: 'Ugli fruit', price: 210, storage: 220, period: 230, size: 240, color: 'red' },
    { id: 22, pname: 'Vanilla', price: 220, storage: 230, period: 240, size: 250, color: 'yellow' },
    { id: 23, pname: 'Watermelon', price: 230, storage: 240, period: 250, size: 260, color: 'red' },
    { id: 24, pname: 'Xigua', price: 240, storage: 250, period: 260, size: 270, color: 'yellow' },
    { id: 25, pname: 'Yuzu', price: 250, storage: 260, period: 270, size: 280, color: 'red' },
    { id: 26, pname: 'Zucchini', price: 260, storage: 270, period: 280, size: 290, color: 'yellow' }
];

export default function Shop() {
    const navigate = useNavigate();

    return (
        <div className="Shop">
            <h2>Shop</h2>
            <div className='product_list'>
                {Product_data.map((product) => {
                    return (
                        <Product_card product={product} />
                    );
                })}
            </div>
            <div className='Nav-button-Shop'>
                <button className='nav-button' onClick={() => navigate('/cart')}>Your Cart</button>
                <button className='nav-button' onClick={() => navigate('/your_market')}>Your Market</button>
                <button className='nav-button' onClick={() => navigate('/')}>Log Out</button>
            </div>
        </div>
    );
}