import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import MarketPage from './Page/MarketPage';
import Cart from './Page/Cart';
import YourMarket from './Page/YourMarket';
import YourOrder from './Page/YourOrder';

function HeaderBar() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', gap: '30px' }}>
      <button onClick={() => navigate('/YourOrder')}>Your Order</button>
      <button onClick={() => navigate('/Cart')}>Cart</button>
    </div>
  );
}

function HeaderBar2() {
  const navigate = useNavigate();
  return (
    <div className='App-header-2'>
      <button onClick={() => navigate('/')}>Find Product</button>
      <button onClick={() => navigate('/YourMarket')}>Your Market</button>
    </div>
  );
}

function App() {

  return (
    <Router>
      <div className="App">

        <div className="App-header-bar">
          <div className='App-header'>
            <div style={{ color: 'white', fontWeight: '800', fontSize: 'large' }}>Timmy Market</div>
            <HeaderBar />
          </div>
        </div>


        <div className='App-body'>
          <HeaderBar2/>
          <Routes>
            <Route path="/YourOrder" element={<YourOrder />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/" element={<MarketPage />} />
            <Route path="/YourMarket" element={<YourMarket />} />
          </Routes>
          <div className='App-footer'>
            <div>@Timmy Market</div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;