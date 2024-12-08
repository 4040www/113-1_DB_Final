import RecProductCard from '../Card/Rec/RecProductCard';
import RecCouponCard from '../Card/Rec/RecCouponCard';
import ProductCard from '../Card/Card/ProductCard';

import { useState, useEffect } from 'react';

export default function MarketPage() {
    const [searchContent, setSearchContent] = useState('');
    const [coupons, setCoupons] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('role');
            setLoading(true);
            try {
                const response_coupon = await fetch(`http://localhost:${window.globalPort}/recommend_coupon`, {
                    method: 'GET',
                });
                const data_coupon = await response_coupon.json();
                console.log('data:', data_coupon);
                setCoupons(data_coupon.data);

                const response_product = await fetch(`http://localhost:${window.globalPort}/get_product?userId=${userId}`, {
                    method: 'GET',
                });
                const data_product = await response_product.json();
                console.log('data:', data_product);
                setProducts(data_product.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // random 6 products
    const randomProducts = products.sort(() => Math.random() - 0.5).slice(0, 6);

    return (
        <div>
            <div className="RecComponent">
                <h2>Recommend Product</h2>
                <RecProductCard products={randomProducts} />
                <h2>Recommend Coupon</h2>
                <RecCouponCard coupons={coupons} setSearchContent={setSearchContent} />
            </div>
            <div style={{ height: '6px', backgroundColor: '#192e63', marginTop: '50px', marginBottom: '35px' }} />
            <ProductCard products={products} searchContent={searchContent} />
        </div>
    );
}
