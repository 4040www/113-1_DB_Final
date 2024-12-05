import '../Card.css';

// TODO : randomly get 6 recommand product
const products = [
    { name: 'Apple', rating: '4.6☆', store: 'Supermarket', price: '$100', color: 'Red', size: 'Medium' },
    { name: 'Orange', rating: '4.0☆', store: 'Grocery Store', price: '$100', color: 'Orange', size: 'Medium' },
    { name: 'Grapes', rating: '4.4☆', store: 'Fruit Market', price: '$300', color: 'Purple', size: 'Small' },
    { name: 'Strawberry', rating: '4.8☆', store: 'Farmers Market', price: '$100', color: 'Red', size: 'Small' },
    { name: 'Watermelon', rating: '4.6☆', store: 'Supermarket', price: '$200', color: 'Green', size: 'Large' },
    { name: 'Pineapple', rating: '4.0☆', store: 'Grocery Store', price: '$100', color: 'Brown', size: 'Large' },
];

// TODO : Add to cart function

export default function RecProductCard() {
    return (
        <div className='RecCard'>
            {products.map((product, index) => (
                <div className="RecCard-content" key={index}>
                    <h3>{product.name} ({product.rating})</h3>
                    <div>{product.store}</div>
                    <div>{product.price} / {product.color} / {product.size}</div>
                    <button>Add to Cart</button>
                </div>
            ))}
        </div>
    );
}
