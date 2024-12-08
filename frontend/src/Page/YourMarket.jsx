import YourCouponCard from "../Card/Card/YourCouponCard";
import YourProductCard from "../Card/Seller/YourProductCard";
import CustomerOrder from "../Card/Seller/CustomerOrder";
import './Page.css';
import { useState, useEffect } from 'react';

export default function YourMarket() {
  const [uploadIsOpen, setUploadIsOpen] = useState(false);
  const [couponIsOpen, setCouponIsOpen] = useState(false);
  const [coupon_data, setCoupon] = useState([]);

  const openUpload = () => setUploadIsOpen(true);
  const closeUpload = () => setUploadIsOpen(false);

  const openCoupon = () => setCouponIsOpen(true);
  const closeCoupon = () => setCouponIsOpen(false);

  // Fetch orders on mount
  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [coupon_data]);

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
            <h2>Upload New Product</h2>
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
                Quality:
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
            <h2>Add New Coupon</h2>
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

      <div className="RecComponent">
        <h2>Your Coupon List</h2>
        <YourCouponCard coupon_data={coupon_data} setCoupon={setCoupon}/>
      </div>

      <div className="YourMarketNav">
        <button onClick={openUpload}>
          <h2>Upload New Product...</h2>
        </button>
        <button onClick={openCoupon}>
          <h2>Add New Coupon...</h2>
        </button>
      </div>

      <div style={{ height: '6px', backgroundColor: '#192e63', marginBottom: '35px' }} />

      <div className="YourMarketCard">
        <YourProductCard />
        <CustomerOrder />
      </div>
    </div>
  );
}
