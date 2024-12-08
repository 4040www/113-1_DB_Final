export default function YourCouponCard({ coupon_data, setCoupon }) {

    const deleteHandler = async (couponid) => {
        try {
            const response = await fetch(`http://localhost:${window.globalPort}/delete_coupon?couponid=${couponid}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete coupon');
            const data = await response.json();
            if (data.status === 'success') {
                console.log('Coupon deleted:', couponid);
                alert('Coupon deleted successfully!');
                setCoupon(coupon_data.filter((item) => item.id !== couponid));
            } else {
                throw new Error(data.message || 'Failed to delete coupon');
            }
        } catch (err) {
            console.error('Delete coupon error:', err);
            alert('Failed to delete coupon');
        }
    }

    return (
        <div className='RecCard'>
            {coupon_data && coupon_data.length > 0 ? (
                coupon_data.map((coupon, index) => (
                    <div key={coupon.couponid} className="RecCard-content">
                        <h3>{coupon.content}</h3>
                        <div>more than ${coupon.condition}</div>
                        <div>Start at {new Date(coupon.start_date).toLocaleDateString()}</div>
                        <div>End at {new Date(coupon.end_date).toLocaleDateString()}</div>
                        <div>Remain Quantity: {coupon.quantity}</div>
                        <button onClick={() => deleteHandler(coupon.couponid)}>Delete</button>
                    </div>
                ))
            ) : (
                <div>No coupons available.</div>
            )}
        </div>
    );
}
