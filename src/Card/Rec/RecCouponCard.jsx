import '../Card.css';

export default function RecCouponCard({ }) {
    return (
        <div className='RecCard'>
            <div className="RecCard-content">
                <h3>30% off</h3>
                <div>Electronics Store</div>
                <div>more than $200</div>
                <button>Go to Market</button>
            </div>
            <div className="RecCard-content">
                <h3>20% off</h3>
                <div>Grocery Store</div>
                <div>more than $150</div>
                <button>Go to Market</button>
            </div>
            <div className="RecCard-content">
                <h3>15% off</h3>
                <div>Fruit Market</div>
                <div>more than $250</div>
                <button>Go to Market</button>
            </div>
            <div className="RecCard-content">
                <h3>10% off</h3>
                <div>Farmers Market</div>
                <div>more than $120</div>
                <button>Go to Market</button>
            </div>
            <div className="RecCard-content">
                <h3>25% off</h3>
                <div>Supermarket</div>
                <div>more than $180</div>
                <button>Go to Market</button>
            </div>
            <div className="RecCard-content">
                <h3>5% off</h3>
                <div>Grocery Store</div>
                <div>more than $130</div>
                <button>Go to Market</button>
            </div>
        </div>
    );
}