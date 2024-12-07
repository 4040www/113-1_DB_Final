import YourCouponCard from "../Card/Card/YourCouponCard";
import YourProductCard from "../Card/Seller/YourProductCard";
import CustomerOrder from "../Card/Seller/CustomerOrder";
import './Page.css';
import { useState, useEffect } from 'react';

export default function YourMarket() {
  const [uploadIsOpen, setUploadIsOpen] = useState(false);
  const [couponIsOpen, setCouponIsOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  const openUpload = () => setUploadIsOpen(true);
  const closeUpload = () => setUploadIsOpen(false);

  const openCoupon = () => setCouponIsOpen(true);
  const closeCoupon = () => setCouponIsOpen(false);

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem('userid'); // Retrieve user ID from localStorage
        if (!userId) throw new Error("User ID not found");

        const response = await fetch(`http://localhost:5000/get_order?userid=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const data = await response.json();
        console.log('Fetched orders:', data); // Debug log
        
        // Ensure the data structure is valid
        if (data.status === 'success' && Array.isArray(data.data)) {
          setOrders(data.data); // Update state with fetched orders
        } else {
          throw new Error('Unexpected response structure');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]); // Clear orders on error
      }
    };

    fetchOrders();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="YourMarket">
      {uploadIsOpen && (
        <div className="modal">
          <div>
            <h2>Upload New Product</h2>
            <form>
              <label>
                Product Name:
                <input type="text" name="productName" />
              </label>
              <br />
              <label>
                Price:
                <input type="number" name="price" />
              </label>
              <br />
              <label>
                Quality:
                <input type="number" name="quality" />
              </label>
              <br />
              <label>
                Refund Period:
                <input type="number" name="refundPeriod" />
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
            <form>
              <label>
                Product Name:
                <input type="text" name="productName" />
              </label>
              <br />
              <label>
                Price:
                <input type="number" name="price" />
              </label>
              <br />
              <button type="submit">Submit</button>
              <button type="button" onClick={closeCoupon}>Close</button>
            </form>
          </div>
        </div>
      )}

      <div className="RecComponent">
        <h2>Your Coupon List</h2>
        <YourCouponCard />
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
