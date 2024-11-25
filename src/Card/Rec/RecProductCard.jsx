import '../Card.css';

export default function RecProductCard({ }) {
    return (
        <div className='RecCard'>
            <div className="RecCard-content">
                <h3>Apple (4.6☆)</h3>
                <div>Supermarket</div>
                <div>$100</div>
                <button>Add to Cart</button>
            </div>
            <div className="RecCard-content">
                <h3>Orange (4.0☆)</h3>
                <div>Grocery Store</div>
                <div>$100</div>
                <button>Add to Cart</button>
                </div>
            <div className="RecCard-content">
                <h3>Grapes (4.4☆)</h3>
                <div>Fruit Market</div>
                <div>$300</div>
                <button>Add to Cart</button>
                </div>
            <div className="RecCard-content">
                <h3>Strawberry (4.8☆)</h3>
                <div>Farmers Market</div>
                <div>$100</div>
                <button>Add to Cart</button>
                </div>
            <div className="RecCard-content">
                <h3>Watermelon (4.6☆)</h3>
                <div>Supermarket</div>
                <div>$200</div>
                <button>Add to Cart</button>
                </div>
            <div className="RecCard-content">
                <h3>Pineapple (4.0☆)</h3>
                <div>Grocery Store</div>
                <div>$100</div>
                <button>Add to Cart</button>
                </div>
        </div>
    );
}