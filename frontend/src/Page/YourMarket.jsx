import YourCouponCard from "../Card/Card/YourCouponCard";
import YourProductCard from "../Card/Seller/YourProductCard";
import CustomerOrder from "../Card/Seller/CustomerOrder";
import './Page.css';
import { useState, useEffect } from 'react';

export default function YourMarket() {
  const [uploadIsOpen, setUploadIsOpen] = useState(false);
  const [couponIsOpen, setCouponIsOpen] = useState(false);
  const [coupon_data, setCoupon] = useState([]);
  const [product_data, setProduct] = useState([]);
  const [order_data, setOrder] = useState([]);
  const [market_data, setMarket] = useState([]);

  const openUpload = () => setUploadIsOpen(true);
  const closeUpload = () => setUploadIsOpen(false);

  const openCoupon = () => setCouponIsOpen(true);
  const closeCoupon = () => setCouponIsOpen(false);

  const fetchCouponData = async () => {
    try {
      // get coupon
      const userId = localStorage.getItem('role'); // Retrieve user ID from localStorage
      if (!userId) throw new Error("User ID not found");

      const response = await fetch(`http://localhost:${window.globalPort}/get_coupon_mine?userid=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch orders');

      const data_coupon = await response.json();
      console.log('Fetched coupons:', data_coupon); // Debug log

      // Ensure the data structure is valid
      if (data_coupon.status === 'success' && Array.isArray(data_coupon.data)) {
        setCoupon(data_coupon.data); // Update state with fetched orders
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setCoupon([]); // Clear orders on error
    }
  };

  // Fetch orders on mount
  useEffect(() => {
    fetchCouponData();
  }, []);

  const fetchProductData = async () => {
    try {
      const userId = localStorage.getItem('role');
      if (!userId) throw new Error("User ID not found");

      const response = await fetch(`http://localhost:${window.globalPort}/get_product_mine?userid=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch orders');

      const data_product = await response.json();
      console.log('Fetched products:', data_product); // Debug log

      if (data_product.status === 'success' && Array.isArray(data_product.data)) {
        setProduct(data_product.data);
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setProduct([]);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const sellerId = localStorage.getItem('role');
      if (!sellerId) throw new Error("User ID not found");

      const response = await fetch(`http://localhost:${window.globalPort}/get_order_seller?sellerid=${sellerId}`);
      if (!response.ok) throw new Error('Failed to fetch orders');

      const data_order = await response.json();
      console.log('Fetched orders:', data_order); // Debug log

      if (data_order.status === 'success' && Array.isArray(data_order.data)) {
        setOrder(data_order.data);
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrder([]);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchMarketData = async () => {
    try {
      const userId = localStorage.getItem('role');
      if (!userId) throw new Error("User ID not found");
      
      const response = await fetch(`http://localhost:${window.globalPort}/get_market?userid=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch market data');

      const data = await response.json();
      console.log('Fetched market data:', data.data); // Debug log

      if (data.status === 'success' && Array.isArray(data.data)) {
        setMarket(data.data[0]);
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (err) {
      console.error('Error fetching market data:', err);
      setMarket([]);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const handleChangeMarketName = async () => {
    try {
      const userId = localStorage.getItem('role');
      if (!userId) throw new Error("User ID not found");

      const marketName = document.getElementsByName('marketName')[0].value;
      if (!marketName) throw new Error("Market Name not found");
      console.log(marketName, userId);
      
      const response = await fetch(`http://localhost:${window.globalPort}/change_market_name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, marketName }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Market name changed successfully!');
        fetchMarketData();
      } else {
        throw new Error(data.message || 'Failed to change market name');
      }
    } catch (err) {
      console.error('Error changing market name:', err);
      alert('Failed to change market name');
    }
  };

  const handelChangeMarketAddress = async () => {
    try {
      const userId = localStorage.getItem('role');
      if (!userId) throw new Error("User ID not found");

      const marketAddress = document.getElementsByName('marketAddress')[0].value;
      if (!marketAddress) throw new Error("Market Address not found");
      
      const response = await fetch(`http://localhost:${window.globalPort}/change_market_address`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, marketAddress }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Market address changed successfully!');
        fetchMarketData();
      } else {
        throw new Error(data.message || 'Failed to change market address');
      }
    } catch (err) {
      console.error('Error changing market address:', err);
      alert('Failed to change market address');
    }
  };

  const handleUploadProduct = async (product) => {
    try {
      const response = await fetch(`http://localhost:${window.globalPort}/upload_product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert(`Product uploaded successfully! Product ID: ${data.productId}`);
        fetchProductData();
      } else {
        throw new Error(data.message || 'Failed to upload product');
      }
    } catch (err) {
      console.error('Error uploading product:', err);
      alert('Failed to upload product');
    }
  };


  const handleAddCoupon = async (coupon) => {
    try {
      console.log(coupon);
      const response = await fetch(`http://localhost:${window.globalPort}/add_coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coupon),
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert(`Coupon added successfully! Coupon ID: ${data.couponId}`);
        fetchCouponData();
      } else {
        throw new Error(data.message || 'Failed to add coupon');
      }
    } catch (err) {
      console.error('Error adding coupon:', err);
      alert('Failed to add coupon');
    }
  };



  return (
    <div className="YourMarket">
      {uploadIsOpen && (
        <div className="modal">
          <div>
            <h2>新增新的商品</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const product = {
                  userId: localStorage.getItem('role'),
                  productName: e.target.productName.value,
                  price: e.target.price.value,
                  storage: e.target.quality.value,
                  refundPeriod: e.target.refundPeriod.value,
                  size: e.target.size.value,
                  color: e.target.color.value,
                };
                handleUploadProduct(product);
                closeUpload();
              }}
            >
              <label>
                Product Name:
                <input type="text" name="productName" required />
              </label>
              <br />
              <label>
                Price:
                <input type="number" name="price" required />
              </label>
              <br />
              <label>
                Quantity:
                <input type="number" name="quality" required />
              </label>
              <br />
              <label>
                Refund Period:
                <input type="number" name="refundPeriod" required />
              </label>
              <br />
              <label>
                Size:
                <select name="size" required>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </select>
              </label>
              <br />
              <label>
                Color:
                <input type="text" name="color" required />
              </label>
              <br />
              <button type="submit">Submit</button>
              <button type="button" onClick={closeUpload}>Close</button>
            </form>
          </div>
        </div>
      )}

      {couponIsOpen && (
        <div className="modal">
          <div>
            <h2>新增優惠券</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const coupon = {
                  content: e.target.content.value,
                  condition: e.target.condition.value,
                  userid: localStorage.getItem('role'),
                  endDate: e.target.endDate.value,
                  quantity: e.target.quantity.value,
                };
                handleAddCoupon(coupon);
                closeCoupon();
              }}
            >
              <label>
                Content:
                <input type="text" name="content" required />
              </label>
              <br />
              <label>
                Condition:
                <input type="text" name="condition" required />
              </label>
              <br />
              <label>
                Expire Date:
                <input type="date" name="endDate" required />
              </label>
              <br />
              <label>
                Quantity:
                <input type="number" name="quantity" required />
              </label>
              <button type="submit">Submit</button>
              <button type="button" onClick={closeCoupon}>Close</button>
            </form>
          </div>
        </div>
      )}
      <div className="" style={{marginTop:'40px'}}>
        <h2>你的優惠券</h2>
        <YourCouponCard coupon_data={coupon_data} setCoupon={setCoupon} />
      </div>

      <div className="YourMarketNav">
        <button onClick={openUpload}>
          <h2>Upload New Product...</h2>
        </button>
        <button onClick={openCoupon}>
          <h2>Add New Coupon...</h2>
        </button>
      </div>
      <h2>賣場名稱：</h2>
      <p>{market_data.mname}</p>
      <input type="text" name="marketName" required placeholder={market_data.mname} style={{height:'30px', width:'300px', borderRadius:'10px', paddingLeft:'10px' }}/>
      <button onClick={()=>handleChangeMarketName()} style={{height:'36px', borderRadius:'10px',width:'80px', marginLeft:'20px'}}>更改</button>
      <h2>賣場地址：</h2>
      <p>{market_data.maddress}</p>
      <input type="text" name="marketAddress" required placeholder={market_data.maddress} style={{height:'30px', width:'300px', borderRadius:'10px', paddingLeft:'10px' }}/>
      <button onClick={()=>handelChangeMarketAddress()} style={{height:'36px', borderRadius:'10px',width:'80px', marginLeft:'20px'}}>更改</button>
      
      <div style={{ height: '6px', backgroundColor: '#192e63', marginBottom: '35px', marginTop:'35px' }} />

      <div className="YourMarketCard">
        <YourProductCard product_data={product_data} fetchProductData={fetchProductData} setProduct={setProduct} />
        <CustomerOrder order_data={order_data} fetchOrderData={fetchOrderData} />
      </div>
    </div>
  );
}
