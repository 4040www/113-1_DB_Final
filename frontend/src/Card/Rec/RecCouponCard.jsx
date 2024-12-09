export default function RecCouponCard({ coupons, setSearchContent }) {
    return (
        <div className='RecCard'>
            {coupons.map((coupon, index) => (
                <div className="RecCard-content" key={index} style={{display:'flex', justifyContent:'space-between', alignContent:'space-between'}}>
                    <h3>{coupon.content}</h3>
                    <div>More than ${coupon.condition}</div>
                    <div>{coupon.mname}</div>
                    <button onClick={() => setSearchContent(coupon.mname)} style={{marginTop:'10px'}}>Go to Market</button>
                </div>
            ))}
        </div>
    );
}
