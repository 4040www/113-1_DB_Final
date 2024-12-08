import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import MarketPage from './Page/MarketPage';
import Cart from './Page/Cart';
import YourMarket from './Page/YourMarket';
import YourOrder from './Page/YourOrder';
import LoginPage from './Page/LoginPage';
import AdminPage from './Page/AdminPage';
import LikeProduct from './Page/LikeProduct';

import ProtectedRoute from './components/ProtectedRoute';

window.globalPort = 5000;

function HeaderBar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // 檢查登入狀態

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // 清除登入狀態
    localStorage.removeItem('role'); // 清除角色
    navigate('/Login'); // 導航到登入頁
  };

  return (
    <div style={{ display: 'flex', gap: '30px' }}>
      {isLoggedIn && (
        <div style={{color:'white',fontWeight:'bold'}}>你好，{localStorage.getItem('role_name')}</div> // 登入時才顯示登出按鈕
      )}
      <button onClick={() => navigate('/YourOrder')}>你的訂單</button>
      <button onClick={() => navigate('/Cart')}>購物車</button>
      <button onClick={() => navigate('/LikeProduct')}>喜歡的商品</button>
      {isLoggedIn && (
        <button onClick={handleLogout}>登出</button> // 登入時才顯示登出按鈕
      )}
    </div>
  );
}


function HeaderBar2() {
  const navigate = useNavigate();
  return (
    <div className='App-header-2'>
      <button onClick={() => navigate('/')}>尋找新商品</button>
      <button onClick={() => navigate('/YourMarket')}>你的賣場</button>
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
          <HeaderBar2 />
          <Routes>
            <Route path="/Login" element={<LoginPage />} style={{ display: 'flex', alignSelf: 'center' }} />
            <Route path="/YourOrder"
              element={
                <ProtectedRoute>
                  <YourOrder />
                </ProtectedRoute>
              } />
            <Route path="/LikeProduct"
              element={
                <ProtectedRoute>
                  <LikeProduct />
                </ProtectedRoute>
              } />
            <Route path="/AdminPage" element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } />
            <Route path="/Cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
            <Route path="/"
              element={
                <ProtectedRoute>
                  <MarketPage />
                </ProtectedRoute>
              } />
            <Route path="/YourMarket"
              element={
                <ProtectedRoute>
                  <YourMarket />
                </ProtectedRoute>
              } />
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