import React, { useState, useEffect } from 'react';

export default function LikeProduct() {
    const [likeData, setLikeData] = useState([]);

    // Fetch liked product data
    const fetchLikeData = async () => {
        try {
            const userId = localStorage.getItem('role');
            const response = await fetch(`http://localhost:${window.globalPort}/get_user_behavior?userid=${userId}&behavior=Favorite`);
            if (!response.ok) throw new Error('Failed to fetch liked products');
            const data = await response.json();

            // Group data by seller_name
            const groupedData = data.data.reduce((acc, item) => {
                const { seller_name, sellerid, productid, product_name, price, behavior } = item;

                if (!acc[seller_name]) {
                    acc[seller_name] = {
                        sellerName: seller_name,
                        sellerId: sellerid,
                        totalPrice: 0,
                        products: [],
                    };
                }
                acc[seller_name].products.push({
                    productId: productid,
                    name: product_name,
                    price,
                });

                return acc;
            }, {});

            setLikeData(Object.values(groupedData));  // Set the grouped liked data
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchLikeData();  // Fetch liked products on component mount
    }, []);

    // Helper function to truncate text and add ellipsis
    const truncate = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

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
            if (!response.ok) throw new Error('Failed to update product behavior');
            if (behavior === 'Browsed') {
                alert('Product removed from liked');
            }
            else{
                alert('Product liked');
            }
        } catch (err) {
            console.error(err.message);
            alert('Failed to update product behavior');
        }
        fetchLikeData(); 
    };

    return (
        <div>
            <h1>Liked Products</h1>
            {likeData.map((seller, sellerIndex) => (
                <div key={sellerIndex} className="CartCard">
                    <div className="CartCard-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <p style={{ fontWeight: 'bolder', fontSize: '20px' }}>
                                {seller.sellerName}
                            </p>
                        </div>
                        <div className="CartCardOrder">
                            {seller.products.map((product, productIndex) => (
                                <div key={productIndex} className="CartCardOrder-content">
                                    <div>
                                        <p
                                            title={product.name} // Tooltip shows full name
                                            style={{ cursor: 'pointer' }} // Indicate tooltip with pointer cursor
                                        >
                                            {truncate(product.name, 20)}
                                        </p>
                                        <p>${product.price.toFixed(2)}</p>
                                    </div>
                                    <button onClick={() => handleUserBehavior(product.productId, "Browsed")}>
                                        Cancel like
                                    </button>
                                    <button onClick={() => handleAddToCart(product.productId)}>
                                        Add To Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
