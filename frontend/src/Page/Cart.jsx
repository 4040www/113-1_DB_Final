import React, { useState, useEffect } from 'react';

export default function Cart() {
    const [cartData, setCartData] = useState([]);
    const [newQuantity, setNewQuantity] = useState({}); // Used to store new quantities of products
    const [addresses, setAddresses] = useState(""); // Used to store addresses per seller
    const [payMethod, setpayMethod] = useState('"Credit-Card"'); // New state to track selected sellers for order
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState({});
    const [selectedCoupons, setSelectedCoupons] = useState({});
    const [couponContent, setCouponContent] = useState({});

    // Fetch cart data from backend
    const fetchCartData = async () => {
        try {
            const userId = localStorage.getItem('role');
            const response = await fetch(`http://localhost:${window.globalPort}/get_cart?userid=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch cart data');
            const data = await response.json();
            const groupedData = await data.data.reduce(async (accPromise, item) => {
                const acc = await accPromise;
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

                // Fetch available coupons for this seller
                try {
                    const couponResponse = await fetch(
                        `http://localhost:${window.globalPort}/get_coupon?sellerid=${sellerid}`
                    );
                    if (!couponResponse.ok) throw new Error('Failed to fetch coupon data');
                    const couponData = await couponResponse.json();
                    setAvailableCoupons((prev) => ({
                        ...prev,
                        [sellerid]: couponData.data,
                    }));
                } catch (err) {
                    console.error(err);
                }

                return acc;
            }, Promise.resolve({}));

            setCartData(Object.values(groupedData));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    const handleCouponSelection = (sellerId, couponId) => {
        setSelectedCoupons((prev) => ({
            ...prev,
            [sellerId]: couponId,
        }));
        // find the coupon.content
        // if discount $A then totalPrice - A 
        // if A% OFF then totalPrice * (1 - A/100)
        if (couponId === 'noValue') {
            setCouponContent((prev) => ({
                ...prev,
                [sellerId]: 0,
            }));
            return;
        }
        const couponContent = availableCoupons[sellerId].find((coupon) => coupon.couponid === couponId);
        if (!couponContent) return;
        if (couponContent.content.includes('OFF')) {
            const discount = parseFloat(couponContent.content.split('%')[0]);
            setCouponContent((prev) => ({
                ...prev,
                [sellerId]: 1 - discount / 100,
            }));
        }
        else if (couponContent.content.includes('$')) {
            const discount = parseFloat(couponContent.content.split('$')[1]);
            setCouponContent((prev) => ({
                ...prev,
                [sellerId]: discount,
            }));
        }
        else {
            alert('Invalid coupon content');
        }
        console.log(couponContent);
    };

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
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            if (!addresses) {
                alert('Please enter an address');
                setIsSubmitting(false);
                return;
            }
    
            const userId = localStorage.getItem('role');
            const sellerData = cartData.find((seller) => seller.sellerId === sellerId);
            const couponId = selectedCoupons[sellerId] || null;
            console.log(couponId, selectedCoupons[sellerId]);
            const discount = (couponContent[sellerId] > 1
                ? sellerData.totalPrice - couponContent[sellerId]
                : (couponContent[sellerId] > 0
                    ? sellerData.totalPrice * couponContent[sellerId]
                    : couponContent[sellerId])
            );
            
            const orderData = [
                {
                    sellerId: sellerData.sellerId,
                    products: sellerData.products.map((product) => ({
                        productId: product.productId,
                        quantity: product.amount,
                        price: product.price,
                    })),
                    amount: discount,
                }
            ];
            console.log(orderData);
            console.log(payMethod);
            const response = await fetch(`http://localhost:${window.globalPort}/add_order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    orderData,
                    startstationadd: '台灣大學',
                    endstationadd: addresses,
                    method: payMethod,
                    couponid:couponId,
                }),
            });
    
            const data = await response.json();
    
            if (data.status === 'success') {
                alert('Order placed successfully');
                fetchCartData();
            } else {
                alert(`Order failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order');
        } finally {
            setIsSubmitting(false);
        }
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
                style={{ width: '150px', height: '36px', marginBottom: '20px' }}
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
                                {seller.sellerName} - ${seller.totalPrice.toFixed(2)} {couponContent[seller.sellerId] ? couponContent[seller.sellerId] < 1 ? `*${couponContent[seller.sellerId] * 100}%` : `- ${couponContent[seller.sellerId]}` : ""}
                            </p>
                            <div className="CartCard-content-button">
                                <button onClick={() => placeOrder(seller.sellerId)} disabled={isSubmitting}>Place Order</button>
                            </div>
                        </div>
                        <select
                            value={selectedCoupons[seller.sellerId] || ''}
                            onChange={(e) => handleCouponSelection(seller.sellerId, e.target.value)}
                        >
                            <option value="noValue">No Coupon</option>
                            {(availableCoupons[seller.sellerId] || []).map((coupon) => (
                                <option key={coupon.couponid} value={coupon.couponid}>
                                    {coupon.content}
                                </option>
                            ))}
                        </select>
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