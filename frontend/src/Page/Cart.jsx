import React, { useState, useEffect } from 'react';

export default function Cart() {
    const [cartData, setCartData] = useState([]);
    const [newQuantity, setNewQuantity] = useState({}); // 用來保存每個商品的新數量

    const fetchCartData = async () => {
        try {
            const userId = localStorage.getItem('role'); // 假設從 localStorage 獲取 userid
            const response = await fetch(`http://localhost:5000/get_cart?userid=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch cart data');
            const data = await response.json();

            // Group data by seller_name
            const groupedData = data.reduce((acc, item) => {
                const { seller_name, sellerid, productid, product_name, price, quantity } = item;

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
                    amount: quantity,
                });
                acc[seller_name].totalPrice += price * quantity;

                return acc;
            }, {});

            setCartData(Object.values(groupedData));
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch cart data from backend
    useEffect(() => {
        fetchCartData();
    }, []);

    // Helper function to truncate text and add ellipsis
    const truncate = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    // Update product quantity in the cart
    const updateQuantity = async (productId, newQuantity) => {
        try {
            const userId = localStorage.getItem('role');
            const response = await fetch(`http://localhost:5000/update_cart_item?userid=${userId}&productid=${productId}&quantity=${newQuantity}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        
            if (!response.ok) throw new Error('Failed to update quantity');
            const data = await response.json();
        
            if (data.status === 'success') {
                // Update local cart data with new quantity
                setCartData(prevData =>
                    prevData.map(seller => ({
                        ...seller,
                        products: seller.products.map(product =>
                            product.productId === productId
                                ? { ...product, amount: newQuantity }
                                : product
                        ),
                    }))
                );
    
                // Optional: Refresh cart data from backend to ensure it's in 
                fetchCartData();
                alert('Quantity updated successfully');
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };
    
    // Handle quantity input change
    const handleQuantityChange = (productId, quantity) => {
        setNewQuantity(prev => ({
            ...prev,
            [productId]: quantity,
        }));
    };

    // Remove product from cart
    const deleteCartItem = async (productId) => {
        try {
            const userId = localStorage.getItem('role');
            const response = await fetch('http://localhost:5000/delete_cart_item?userid=' + userId + '&productid=' + productId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            

            if (!response.ok) throw new Error('Failed to delete cart item');
            const data = await response.json();

            if (data.status === 'success') {
                // Remove product from local cart data
                setCartData(prevData =>
                    prevData.map(seller => ({
                        ...seller,
                        products: seller.products.filter(product => product.productId !== productId),
                    }))
                );2
                alert('Product removed from cart');
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Handle "Change Amount" button click
    const handleChangeAmount = (productId) => {
        const quantity = newQuantity[productId] || 0;
        if (quantity <= 0) {
            // If quantity is 0 or negative, remove the item
            deleteCartItem(productId);
        } else {
            // Otherwise, update the quantity
            updateQuantity(productId, quantity);
        }
    };

    return (
        <div>
            <h1>購物車</h1>
            {cartData.map((seller, sellerIndex) => (
                <div key={sellerIndex} className="CartCard">
                    <div className="CartCard-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <p style={{ fontWeight: 'bolder', fontSize: '20px' }}>
                                {truncate(seller.sellerName, 15)} -
                                ${seller.totalPrice.toFixed(2)}
                            </p>
                            <div className="CartCard-content-button">
                                <button>Order</button>
                            </div>
                        </div>
                        <div className="CartCardOrder">
                            {seller.products.map((product, productIndex) => (
                                <div key={productIndex} className="CartCardOrder-content">
                                    <div>
                                        {/* Display product name with a hover tooltip */}
                                        <p
                                            title={product.name} // Tooltip shows full name
                                            style={{ cursor: 'pointer' }} // Indicate tooltip with pointer cursor
                                        >
                                            {truncate(product.name, 20)}
                                        </p>
                                        <p>${product.price.toFixed(2)}</p>
                                        <span>Amount:</span>
                                        <input
                                            type="number"
                                            value={newQuantity[product.productId] || product.amount} // Default to current amount
                                            onChange={(e) =>
                                                handleQuantityChange(product.productId, e.target.value)
                                            }
                                            style={{ width: '50px' }}
                                        />
                                    </div>
                                    <button onClick={() => deleteCartItem(product.productId)}>
                                        Remove
                                    </button>
                                    <button onClick={() => handleChangeAmount(product.productId)}>
                                        Change Amount
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
