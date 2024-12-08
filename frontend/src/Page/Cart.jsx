import React, { useState, useEffect } from 'react';

export default function Cart() {
    const [cartData, setCartData] = useState([]);
    const [newQuantity, setNewQuantity] = useState({}); // Used to store new quantities of products
    const [addresses, setAddresses] = useState(""); // Used to store addresses per seller
    const [payMethod, setpayMethod] = useState({}); // New state to track selected sellers for order
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch cart data from backend
    const fetchCartData = async () => {
        try {
            const userId = localStorage.getItem('role'); // Corrected to 'userId'
            const response = await fetch(`http://localhost:${window.globalPort}/get_cart?userid=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch cart data');
            const data = await response.json();
            console.log('Fetched cart data:', data); // Debugging line
            // Group data by seller_name
            const groupedData = data.data.reduce((acc, item) => {
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

    useEffect(() => {
        fetchCartData();
    }, []);

    const truncate = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            const userId = localStorage.getItem('role');
            const response = await fetch(`http://localhost:${window.globalPort}/update_cart_item?userid=${userId}&productid=${productId}&quantity=${newQuantity}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to update quantity');
            const data = await response.json();

            if (data.status === 'success') {
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
                fetchCartData();
                alert('Quantity updated successfully');
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleQuantityChange = (productId, quantity) => {
        setNewQuantity(prev => ({
            ...prev,
            [productId]: quantity,
        }));
    };

    const deleteCartItem = async (productId) => {
        try {
            const userId = localStorage.getItem('role');
            const response = await fetch(`http://localhost:${window.globalPort}/delete_cart_item?userid=${userId}&productid=${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) throw new Error('Failed to delete cart item');
            const data = await response.json();
    
            if (data.status === 'success') {
                setCartData(prevData =>
                    prevData.map(seller => ({
                        ...seller,
                        products: seller.products.filter(product => product.productId !== productId),
                    })).filter(seller => seller.products.length > 0) // Ensure that sellers with no products are removed
                );
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };
    

    const handleChangeAmount = (productId) => {
        const quantity = newQuantity[productId] || 0;
        if (quantity <= 0) {
            deleteCartItem(productId);
        } else {
            updateQuantity(productId, quantity);
        }
    };

    const placeOrder = async (sellerId) => {
        if (isSubmitting) return; // 如果正在提交，則不做任何事
        setIsSubmitting(true); // 設置為提交中
        try {
            // 檢查地址
            if (!addresses) {
                alert('Please enter an address');
                setIsSubmitting(false);
                return;
            }

            const userId = localStorage.getItem('role');
            const orderData = cartData
                .filter(seller => seller.sellerId === sellerId) // 只發送選定賣家的資料
                .map(seller => ({
                    sellerId: seller.sellerId,
                    products: seller.products.map(product => ({
                        productId: product.productId,
                        quantity: product.amount,
                        price: product.price,
                    })),
                }));
            const method = payMethod;
            const startstationadd = '台灣大學';
            const endstationadd = addresses;

            // 禁用按鈕防止重複提交
            const response = await fetch('http://localhost:${window.globalPort}/add_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, orderData, startstationadd, endstationadd, method }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert('Order placed successfully');
                // 刪除訂單中的產品
                for (let i = 0; i < orderData[0].products.length; i++) {
                    const productId = orderData[0].products[i].productId;
                    await deleteCartItem(productId);
                    setIsSubmitting(false);
                }
            } else {
                console.error(data.message);
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error(err);
        }

        // 不再重複抓取 cartData
        // fetchCartData(); // 刪除這行，避免重複載入
    };

    if (cartData.length === 0) {
        return <p>Your cart is empty!</p>; // Display when the cart is empty
    }

    return (
        <div>
            <h1>購物車</h1>
            <h3>輸入你的地址：</h3>
            <input
                type="text"
                placeholder="Enter address"
                value={addresses}
                onChange={(e) => setAddresses(e.target.value)}
                style={{ width: '300px', height: '30px', marginBottom: '20px' }}
            />
            <h3>選擇付款方式：</h3>
            <select
                value={payMethod}
                onChange={(e) => setpayMethod(e.target.value)}
                style={{ width: '150px', height: '36px', marginBottom: '20px'  }}
            >
                <option value="Credit-Card">信用卡</option>
                <option value="LinePay">LinePay</option>
                <option value="Cash">現金</option>
            </select>
            {cartData.map((seller, sellerIndex) => (
                <div key={sellerIndex} className="CartCard">
                    <div className="CartCard-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <p style={{ fontWeight: 'bolder', fontSize: '20px' }}>
                                {seller.sellerName} - ${seller.totalPrice.toFixed(2)}
                            </p>
                            <div className="CartCard-content-button">
                                <button onClick={() => placeOrder(seller.sellerId)} disabled={isSubmitting}>Place Order</button>
                            </div>
                        </div>
                        <div className="CartCardOrder">
                            {seller.products.map((product, productIndex) => (
                                <div key={productIndex} className="CartCardOrder-content">
                                    <div>
                                        <p
                                            title={product.name}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {truncate(product.name, 20)}
                                        </p>
                                        <p>${product.price.toFixed(2)}</p>
                                        <span>Amount:</span>
                                        <input
                                            type="number"
                                            value={newQuantity[product.productId] || product.amount}
                                            onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
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
