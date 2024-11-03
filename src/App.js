import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Login from './Login/login';
import Shop from './Shop/shop';
import Cart from './Cart/cart';
import Market from './Market/market';
import Order from './Order/order';
import Market_order from './Market_order/market_order';

function App() {
  return (
    <Router>
      <div className="App">
        <div>
          <Sidebar_left />
        </div>
        <div>
          <div className='GUI-bar'>
            <h2>TIMMY MARKET ⊗</h2>
          </div>
          <div className='GUI'>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/your_market" element={<Market />} />
              <Route path="/order" element={<Order />} />
              <Route path="/market_order" element={<Market_order />} />
            </Routes>
          </div>
        </div>
        <div>
          <Sidebar_right />
        </div>
      </div>
    </Router>
  );
}

function Sidebar_left() {
  const navigate = useNavigate();
  return (
    <div className='Nav-sidebar'>
      <button onClick={() => navigate('/shop')}>Shop</button>
      <button onClick={() => navigate('/cart')}>Your Cart</button>
      <button onClick={() => navigate('/order')}>Order</button>
      <button onClick={() => navigate('/')}>Log Out</button>
    </div>
  );
}

function Sidebar_right() {
  const navigate = useNavigate();
  return (
    <div className='Nav-sidebar'>
      <button onClick={() => navigate('/your_market')}>Your Market</button>
      <button onClick={() => navigate('/market_order')}>Market Order</button>
      <button onClick={() => navigate('/your_market')}>Upload Product</button>
    </div>
  );
}

export default App;