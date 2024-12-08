import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/*

alice.chen@gmail.com
Pass@1234


bob.lin@yahoo.com
Secure$5678

*/

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (username === '' || password === '') {
        alert('帳號或密碼不得為空');
        return;
      }

      // 檢查是否為管理員登入
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', 'admin'); // 儲存角色
        navigate('/AdminPage'); // 導航到管理員頁面
        alert('管理者登入成功');
        return;
      }

      // 非管理員帳號的登入處理
      const response = await fetch(`http://localhost:${window.globalPort}/get_user_login_info?email=` + username);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('data:', data.data);

      if (data.data.length > 0) {
        const user = data.data;
        console.log(user[0].password);
        console.log(password);

        if (user[0].password === password) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('role', user[0].userid); // 儲存角色
          localStorage.setItem('role_name', user[0].name); // 儲存角色

          // 根據角色導向不同頁面
          if (user.role === 'admin') {
            navigate('/AdminPage');
          } else {
            navigate('/');
          }
        } else {
          alert('帳號或密碼錯誤');
        }
      } else {
        alert('帳號或密碼錯誤');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('登入失敗，請稍後再試');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
      <h1>登入</h1>
      <input
        type="text"
        placeholder="使用者名稱"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ height: '30px' }}
      />
      <input
        type="password" // 將密碼框類型改為password
        placeholder="密碼"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ height: '30px' }}
      />
      <button
        onClick={handleLogin}
        style={{ height: '30px', marginTop: '15px', marginBottom: '15px' }}
      >登入</button>
    </div>
  );
}

export default LoginPage;
