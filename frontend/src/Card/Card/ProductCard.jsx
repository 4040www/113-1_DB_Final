import React, { useState } from 'react';
import '../Card.css';

// TODO: Get Product from backend
const products = [
    { name: 'Apple', rating: 4.6, store: 'Supermarket', price: 100, color: 'Red', size: 'Medium' },
    { name: 'Orange', rating: 4.2, store: 'Grocery Store', price: 100, color: 'Orange', size: 'Medium' },
    { name: 'Grapes', rating: 4.8, store: 'Fruit Market', price: 300, color: 'Purple', size: 'Small' },
    { name: 'Strawberry', rating: 4.5, store: 'Farmers Market', price: 100, color: 'Red', size: 'Small' },
    { name: 'Watermelon', rating: 4.3, store: 'Supermarket', price: 200, color: 'Green', size: 'Large' },
    { name: 'Pineapple', rating: 4.1, store: 'Grocery Store', price: 100, color: 'Brown', size: 'Large' },
    { name: 'Apple', rating: 4.6, store: 'Supermarket', price: 100, color: 'Red', size: 'Medium' },
    { name: 'Orange', rating: 4.2, store: 'Grocery Store', price: 100, color: 'Orange', size: 'Medium' },
    { name: 'Grapes', rating: 4.8, store: 'Fruit Market', price: 300, color: 'Purple', size: 'Small' },
    { name: 'Strawberry', rating: 4.5, store: 'Farmers Market', price: 100, color: 'Red', size: 'Small' },
    { name: 'Watermelon', rating: 4.3, store: 'Supermarket', price: 200, color: 'Green', size: 'Large' },
    { name: 'Pineapple', rating: 4.1, store: 'Grocery Store', price: 100, color: 'Brown', size: 'Large' },
    { name: 'Apple', rating: 4.6, store: 'Supermarket', price: 100, color: 'Red', size: 'Medium' },
    { name: 'Orange', rating: 4.2, store: 'Grocery Store', price: 100, color: 'Orange', size: 'Medium' },
    { name: 'Grapes', rating: 4.8, store: 'Fruit Market', price: 300, color: 'Purple', size: 'Small' },
    { name: 'Strawberry', rating: 4.5, store: 'Farmers Market', price: 100, color: 'Red', size: 'Small' },
    { name: 'Watermelon', rating: 4.3, store: 'Supermarket', price: 200, color: 'Green', size: 'Large' },
    { name: 'Pineapple', rating: 4.1, store: 'Grocery Store', price: 100, color: 'Brown', size: 'Large' },
    { name: 'Apple', rating: 4.6, store: 'Supermarket', price: 100, color: 'Red', size: 'Medium' },
    { name: 'Orange', rating: 4.2, store: 'Grocery Store', price: 100, color: 'Orange', size: 'Medium' },
    { name: 'Grapes', rating: 4.8, store: 'Fruit Market', price: 300, color: 'Purple', size: 'Small' },
    { name: 'Strawberry', rating: 4.5, store: 'Farmers Market', price: 100, color: 'Red', size: 'Small' },
    { name: 'Watermelon', rating: 4.3, store: 'Supermarket', price: 200, color: 'Green', size: 'Large' },
    { name: 'Orange', rating: 4.2, store: 'Grocery Store', price: 100, color: 'Orange', size: 'Medium' },
    { name: 'Grapes', rating: 4.8, store: 'Fruit Market', price: 300, color: 'Purple', size: 'Small' },
    { name: 'Strawberry', rating: 4.5, store: 'Farmers Market', price: 100, color: 'Red', size: 'Small' },
    { name: 'Watermelon', rating: 4.3, store: 'Supermarket', price: 200, color: 'Green', size: 'Large' },
    { name: 'Pineapple', rating: 4.1, store: 'Grocery Store', price: 100, color: 'Brown', size: 'Large' },
];

const PRODUCTS_PER_PAGE = 24;

export default function ProductCard({ searchContent }) {
    const [page, setPage] = useState(1);

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)) {
            setPage(page + 1);
        }
    };

    // TODO : revise with database function
    const filteredProducts = products.filter(product => product.store.toLowerCase().includes(searchContent.toLowerCase()));

    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    return (
        <div>
            <div className='FindProduct'>
                <p style={{ fontWeight: 'bold', fontSize: '30px' }}>Find Product</p>
                {/* # TODO: Search Input */}
                <div style={{display:'flex', gap:'20px'}}>
                    <select style={{borderRadius:'20px'}}>
                        <option value="Market">Market</option>
                        <option value="PName">Product Name</option>
                        <option value="PrizeBelow">Prize Below</option>
                        <option value="PrizeUp">Prize Up</option>
                    </select>
                    <form>
                        <input className='SearchInput' type="text" placeholder="Search..." />
                    </form>
                </div>
            </div>
            <div>
                <div className='ProductCard'>
                    {currentProducts.map((product, index) => (
                        <div className="ProductCard-content" key={index}>
                            <h3>{product.name} ({product.rating}☆)</h3>
                            <div>{product.store}</div>
                            <div>${product.price} / {product.color} / {product.size}</div>
                            <div className='ProductCard-content-button'>
                                <button>Add to Cart</button>
                                <button>Like</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '30px', padding: '30px', alignItems: 'center' }}>
                    <button onClick={handlePreviousPage} disabled={page === 1}>previous page</button>
                    <h3 style={{ margin: '0 auto' }}>{page}</h3>
                    <button onClick={handleNextPage} disabled={page === Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)}>next page</button>
                </div>
            </div>
        </div>
    );
}
