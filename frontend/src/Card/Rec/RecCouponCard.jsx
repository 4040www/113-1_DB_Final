import '../Card.css';

// TODO : randomly get 6 recommand coupon
const coupons = [
    { discount: '30% off', store: 'Electronics Store', condition: 'more than $200' },
    { discount: '20% off', store: 'Grocery Store', condition: 'more than $150' },
    { discount: '15% off', store: 'Fruit Market', condition: 'more than $250' },
    { discount: '10% off', store: 'Farmers Market', condition: 'more than $120' },
    { discount: '25% off', store: 'Supermarket', condition: 'more than $180' },
    { discount: '5% off', store: 'Grocery Store', condition: 'more than $130' },
];

export default function RecCouponCard({ searchContent }) {
    return (
        <div className='RecCard'>
            {coupons.map((coupon, index) => (
                <div className="RecCard-content" key={index}>
                    <h3>{coupon.discount}</h3>
                    <div>{coupon.store}</div>
                    <div>{coupon.condition}</div>
                    <button onClick={() => searchContent(coupon.store)}>Go to Market</button>
                </div>
            ))}
        </div>
    );
}
