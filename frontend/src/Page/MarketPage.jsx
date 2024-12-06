import RecProductCard from '../Card/Rec/RecProductCard';
import RecCouponCard from '../Card/Rec/RecCouponCard';
import ProductCard from '../Card/Card/ProductCard';

import{ useState } from 'react';

export default function MarketPage({ }) {
    const [searchContent, setSearchContent] = useState('');
    return (
        <div>
            <div className="RecComponent">
                {/* # TODO: Get Recommand Product*/}
                <h2>Recommend Product</h2>
                <RecProductCard />
                {/* # TODO: Get Recommand Coupon*/}
                <h2>Recommend Coupon</h2>
                <RecCouponCard searchContent={setSearchContent} />
            </div>
            <div style={{ height: '6px', backgroundColor: '#192e63', marginTop: '50px', marginBottom: '35px' }} />
            {/* # TODO: Get Product and split to page*/}
            <ProductCard searchContent={searchContent}  />
        </div>
    );
}

/*
Example of fetching data from backend:

import React, { useEffect, useState } from 'react';

const DataComponent = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/get_data')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>來自後端的數據</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default DataComponent;

*/