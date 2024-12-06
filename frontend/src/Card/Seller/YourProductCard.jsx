import '../Card.css';

const products = [
  { id: 1, name: 'Apple', price: 30, rating: 4.6, remain: 200, sale: 400, refundPeriod: 7 },
  { id: 2, name: 'Orange', price: 40, rating: 4.2, remain: 180, sale: 350, refundPeriod: 6 },
  { id: 3, name: 'Grapes', price: 60, rating: 4.5, remain: 120, sale: 250, refundPeriod: 8 },
  { id: 4, name: 'Strawberry', price: 70, rating: 4.7, remain: 100, sale: 200, refundPeriod: 10 },
  { id: 5, name: 'Pineapple', price: 80, rating: 4.3, remain: 90, sale: 150, refundPeriod: 9 },
  { id: 6, name: 'Watermelon', price: 50, rating: 4.4, remain: 110, sale: 300, refundPeriod: 5 },
  { id: 7, name: 'Mango', price: 90, rating: 4.8, remain: 70, sale: 100, refundPeriod: 12 },
  { id: 8, name: 'Peach', price: 55, rating: 4.1, remain: 130, sale: 220, refundPeriod: 6 },
];

export default function YourProductCard() {
  return (
    <div className='MarketCard'>
      <h2>Your Product</h2>
      <div className='YourProductCard'>
        {products.map((product) => (
          <div key={product.id} className="YourProductCard-content">
            <h3>
              {product.name} ${product.price} ({product.rating}☆)
            </h3>
            <div>Remain: {product.remain}</div>
            <div>Sale: {product.sale}</div>
            <div>Refund Period: {product.refundPeriod} days</div>
            <div className='YourProductCard-content-button'>
              <button>Delete</button>
              <button>Feedback</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
