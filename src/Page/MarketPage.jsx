import RecProductCard from '../Card/Rec/RecProductCard';
import RecCouponCard from '../Card/Rec/RecCouponCard';
import ProductCard from '../Card/Card/ProductCard';

export default function MarketPage({ }) {
    return (
        <div>
            <div className="RecComponent">
                {/* # TODO: Get Recommand Product*/}
                <h2>Recommand Product</h2>
                <RecProductCard />
                {/* # TODO: Get Recommand Coupon*/}
                <h2>Recommand Coupon</h2>
                <RecCouponCard />
            </div>
            <div style={{ height: '6px', backgroundColor: '#192e63', marginTop: '50px', marginBottom: '35px' }} />
            <div className='FindProduct'>
                <p style={{fontWeight:'bold', fontSize:'30px'}}>Find Product</p>
                {/* # TODO: Search Input */}
                <form>
                    <input className='SearchInput' type="text" placeholder="Search..." />
                </form>
            </div>
            {/* # TODO: Get Product and split to page*/}
            <ProductCard />
        </div>
    );
}