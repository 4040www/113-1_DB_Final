import React, { useState, useEffect } from 'react';
import '../Card.css';
import { use } from 'react';

const PRODUCTS_PER_PAGE = 24;

export default function ProductCard({ products, searchContent }) {
    const [page, setPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [searchOption, setSearchOption] = useState('Market');

    // when searchContent changes, reset page to 1 and searchValue to searchContent
    useEffect(() => {
        setPage(1);
        setSearchValue(searchContent);
        console.log('searchContent:', searchValue);
    }, [searchContent]);

    console.log('searchValue:', searchValue);

    // Filter products based on search criteria
    const filteredProducts = products.filter((product) => {
        if (!searchValue) return true;

        if (searchOption === 'Market') {
            return product.market_name?.toLowerCase().includes(searchValue.toLowerCase());
        }
        if (searchOption === 'PName') {
            return product.pname?.toLowerCase().includes(searchValue.toLowerCase());
        }
        if (searchOption === 'PrizeBelow') {
            return product.price <= Number(searchValue);
        }
        if (searchOption === 'PrizeUp') {
            return product.price >= Number(searchValue);
        }
        return true;
    });

    // console.log('filteredProducts:', filteredProducts);

    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    console.log('currentProducts:', currentProducts);

    const handleAddToCart = async (productId) => {
        try {
            const userId = localStorage.getItem('role');
            const response = await fetch(
                `http://localhost:${window.globalPort}/add_to_cart?userid=${userId}&productid=${productId}`,
                { method: 'POST' }
            );
            if (!response.ok) throw new Error('Failed to add to cart');
            alert('Product added to cart');
        } catch (err) {
            console.error(err.message);
            alert('Failed to add to cart');
        }
    };

    const handleUserBehavior = async (productId, behavior) => {
        try {
            const userId = localStorage.getItem('role');
            const response = await fetch(
                `http://localhost:${window.globalPort}/userbehavior?userid=${userId}&productid=${productId}&behavior=${behavior}`,
                { method: 'POST' }
            );
            if (!response.ok) throw new Error('Failed to like product');
            if (behavior === 'Not-Interested') {
                alert('Product removed from feed');
            }
            else if (behavior === 'Report') {
                alert('Product reported');
            }
            else {
                alert('Product liked');
            }
        } catch (err) {
            console.error(err.message);
            alert('Failed to like product');
        }
    }

    return (
        <div>
            <div className="FindProduct">
                <h2>Find Product</h2>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <select
                        style={{ borderRadius: '20px', height: '40px' }}
                        value={searchOption}
                        onChange={(e) => setSearchOption(e.target.value)}
                    >
                        <option value="Market">Market</option>
                        <option value="PName">Product Name</option>
                        <option value="PrizeBelow">Price Below</option>
                        <option value="PrizeUp">Price Above</option>
                    </select>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setSearchValue(e.target.elements.searchInput.value);
                        }}
                    >
                        <input
                            className="SearchInput"
                            name="searchInput"
                            type="text"
                            placeholder="Search..."
                        />
                        <button type="submit" style={{ borderRadius: '20px', height: '40px', width: '100px', marginRight: '20px' }}>Search</button>
                    </form>
                </div>
            </div>

            <div>
                <div className="ProductCard">
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                            <div className="ProductCard-content" key={product.id}>
                                <h3>{product.pname}</h3>
                                <div>{product.market_name}</div>
                                <div>${product.price} / {product.color} / {product.size}</div>
                                <div>
                                    <div className="ProductCard-content-button">

                                        <button onClick={() => handleUserBehavior(product.productid, 'Favorite')}>
                                            Like
                                        </button>
                                        <button onClick={() => handleUserBehavior(product.productid, 'Not-Interested')}>
                                            See less
                                        </button>
                                        <button onClick={() => handleUserBehavior(product.productid, 'Report')}>
                                            Report
                                        </button>
                                    </div>
                                    <button onClick={() => handleAddToCart(product.productid)} style={{width:'100%', marginTop:'10px', backgroundColor:'#dfebef', borderWidth:'1px', height:'30px'}}>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No products found</p>
                    )}
                </div>

                <div style={{ width: '100%', marginTop: '10px', display: 'flex', flexDirection: 'row' }}>
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span>Page {page}</span>
                    <button
                        onClick={() =>
                            setPage((prev) => Math.min(prev + 1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)))
                        }
                        disabled={page === Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)}
                    >
                        Next
                    </button>
                </div>
            </div>

        </div>
    );
}
