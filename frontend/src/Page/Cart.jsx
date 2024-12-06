export default function Cart({ }) {
    // Example data for the cart items
    const cartItems = [
        {
            marketName: "MarketName",
            totalPrice: 3000,
            products: [
                { name: "Apple", price: 30, amount: 20 },
                { name: "Banana", price: 20, amount: 15 },
                { name: "Cherry", price: 50, amount: 10 },
            ],
        },
        {
            marketName: "AnotherMarket",
            totalPrice: 1500,
            products: [
                { name: "Mango", price: 40, amount: 5 },
                { name: "Pineapple", price: 80, amount: 2 },
            ],
        },
    ];

    return (
        <div>
            <h1>Cart</h1>
            {cartItems.map((market, marketIndex) => (
                <div key={marketIndex} className="CartCard">
                    <div className="CartCard-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <p style={{ fontWeight: 'bolder', fontSize: '20px' }}>
                                {market.marketName} ${market.totalPrice}
                            </p>
                            <div className='CartCard-content-button'>
                                <button>Order</button>
                            </div>
                        </div>
                        <div className='CartCardOrder'>
                            {market.products.map((product, productIndex) => (
                                <div key={productIndex} className="CartCardOrder-content">
                                    <div>
                                        <p>{product.name} ${product.price}</p>
                                        Amount: 
                                        <input
                                            type="number"
                                            defaultValue={product.amount}
                                            style={{ width: '50px' }}
                                        />
                                    </div>
                                    <button>Remove</button>
                                    <button>Change Amount</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
