import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('isLoggedIn', 'true'); // 儲存登入狀態
      localStorage.setItem('role', 'admin'); // 儲存角色
      navigate('/AdminPage'); // 導航到管理員頁面
    } else if (username === 'user' && password === 'password') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', 'user'); // 儲存角色
      navigate('/'); // 導航到一般使用者首頁
    } else {
      alert('帳號或密碼錯誤');
    }
  };

  return (
    <div style={{display:'flex',flexDirection:'column',width:'300px',gap:'10px' }}>
      <h1>登入</h1>
      <input
        type="text"
        placeholder="使用者名稱"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ height: '30px' }}
      />
      <input
        type="password"
        placeholder="密碼"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ height: '30px' }}
      />
      <button onClick={handleLogin}
        style={{ height: '30px', marginTop: '15px', marginBottom: '15px' }}
        onKeyDown={e => e.key === 'Enter'}
      >登入</button>
    </div>
  );
}

export default LoginPage;
