import YourCouponCard from "../Card/Card/YourCouponCard";
import YourProductCard from "../Card/Seller/YourProductCard";
import CustomerOrder from "../Card/Seller/CustomerOrder";
import './Page.css'
import { useState } from 'react';

export default function YourMarket({ }) {

    const [uploadIsOpen, setUploadIsOpen] = useState(false);
    const [couponIsOpen, setCouponIsOpen] = useState(false);

    const openUpload = () => {
      setUploadIsOpen(true);
    };
  
    const closeUpload = () => {
      setUploadIsOpen(false);
    };

    const openCoupon = () => {
        setCouponIsOpen(true);
      };
    
      const closeCoupon = () => {
        setCouponIsOpen(false);
      };


    return (
        <div className="">
            {uploadIsOpen && (
                <div>
                    <div
                        isOpen={uploadIsOpen}
                        onRequestClose={closeUpload}
                        contentLabel="Upload New Product"
                    >
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
                            <button type="submit">Submit</button>
                            <button type="button" onClick={closeUpload}>Close</button>
                        </form>
                    </div>
                </div>
            )}
            {couponIsOpen && (
                <div>
                    <div
                        isOpen={couponIsOpen}
                        onRequestClose={closeUpload}
                        contentLabel="Upload New Product"
                    >
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