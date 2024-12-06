const orders = [
  {
    id: 1,
    marketName: 'MarketName',
    totalPrice: 3000,
    status: 'delivering',
    purchaseDate: '2024 / 10 / 25',
    products: [
      { id: 1, name: 'Apple', price: 30, amount: 20 },
      { id: 2, name: 'Orange', price: 40, amount: 15 },
    ],
  },
  {
    id: 2,
    marketName: 'MarketName',
    totalPrice: 3000,
    status: 'delivering',
    purchaseDate: '2024 / 10 / 25',
    products: [
      { id: 1, name: 'Apple', price: 30, amount: 20 },
      { id: 2, name: 'Grapes', price: 60, amount: 10 },
    ],
  },
  {
    id: 3,
    marketName: 'MarketName',
    totalPrice: 3000,
    status: 'Checking',
    purchaseDate: '2024 / 10 / 25',
    products: [
      { id: 1, name: 'Apple', price: 30, amount: 20 },
      { id: 2, name: 'Watermelon', price: 50, amount: 5 },
    ],
  },
];

export default function YourOrder() {
  return (
    <div>
      <h1>YourOrder</h1>
      <div className='YourOrderCard'>
        {orders.map((order) => (
          <div key={order.id} className="YourOrderCard-content">
            <div className="YourOrderCard-info">
              <h3>{order.marketName} ${order.totalPrice}</h3>
              <div>Status : {order.status}</div>
              <div>Purchase Date : {order.purchaseDate}</div>
              <div className='YourOrderCard-content-button'>
                <button>{order.status !== 'Checking' ? 'Refund' : 'Cancel'}</button>
                <button>Feedback</button>
              </div>
            </div>
            <div className='YourProductCardinOrder'>
              {order.products.map((product) => (
                <div key={product.id} className="YourProductCardinOrder-content">
                  <h3>{product.name} ${product.price}</h3>
                  <div>Amount : {product.amount}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
