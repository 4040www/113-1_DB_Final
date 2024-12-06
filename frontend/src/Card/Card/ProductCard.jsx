import React, { useState, useEffect } from 'react';
import '../Card.css';

const PRODUCTS_PER_PAGE = 24;

export default function ProductCard() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [searchOption, setSearchOption] = useState('Market');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/get_product');
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                console.log(data);
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filter products based on search criteria
    const filteredProducts = products.filter((product) => {
        if (!searchValue) return true;

        if (searchOption === 'Market') {
            return product.store?.toLowerCase().includes(searchValue.toLowerCase());
        }
        if (searchOption === 'PName') {
            return product.name?.toLowerCase().includes(searchValue.toLowerCase());
        }
        if (searchOption === 'PrizeBelow') {
            return product.price <= Number(searchValue);
        }
        if (searchOption === 'PrizeUp') {
            return product.price >= Number(searchValue);
        }
        return true;
    });

    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);
    // console.log('currentProducts:', currentProducts);

    const handleAddToCart = async (productId) => {
        try {
            const userId = localStorage.getItem('role');
            console.log('userId:', userId);
            console.log('productId:', productId);
            const response = await fetch(
                `http://localhost:5000/add_to_cart?userid=${userId}&productid=${productId}`,
                { method: 'POST' }
            );
            if (!response.ok) throw new Error('Failed to add to cart');
            alert('Product added to cart');
        } catch (err) {
            console.error(err.message);
            alert('Failed to add to cart');
        }
    };

    return (
        <div>
            <div className="FindProduct">
                <h2>Find Product</h2>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <select
                        style={{ borderRadius: '20px' }}
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
                        <button type="submit">Search</button>
                    </form>
                </div>
            </div>
            {loading ? (
                <p>Loading products...</p>
            ) : error ? (
                <p>Error loading products: {error}</p>
            ) : (
                <div>
                    <div className="ProductCard">
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <div className="ProductCard-content" key={product.id}>
                                    <h3>
                                        {product.pname}
                                    </h3>
                                    <div>{product.store}</div>
                                    <div>
                                        ${product.price} / {product.color} / {product.size}
                                    </div>
                                    <div className="ProductCard-content-button">
                                        <button onClick={() => handleAddToCart(product.productid)}>
                                            Add to Cart
                                        </button>
                                        <button onClick={() => handleAddToCart(product.productid)}>
                                            Like
                                        </button>
                                        <button onClick={() => handleAddToCart(product.productid)}>
                                            Report
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
            )
            }
        </div >
    );
}
