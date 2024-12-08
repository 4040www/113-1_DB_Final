import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/*

alice.chen@gmail.com
Pass@1234


bob.lin@yahoo.com
Secure$5678

george.wu@icloud.com
Geo$rge123

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
          localStorage.setItem('admin', 'no');

          // 根據角色導向不同頁面
          if (user[0].state === 'Admin') {
            localStorage.setItem('admin', 'yes');
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    birthday: '',
    marketName: '',
    marketAddress: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    const { name, email, phone, password, birthday, marketName, marketAddress } = formData;

    if (!name || !email || !phone || !password) {
      alert('請填寫所有必填欄位');
      return;
    }

    try {
      const response = await fetch(`http://localhost:${window.globalPort}/register_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          birthday: birthday || null,
          mname: marketName || null,
          maddress: marketAddress || null,
        }),
      });

      if (response.ok) {
        alert('註冊成功！');
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          birthday: '',
          marketName: '',
          marketAddress: '',
        });
      } else {
        const errorData = await response.json();
        alert('註冊失敗: ' + errorData.message);
      }
    } catch (err) {
      console.error('Register error:', err);
      alert('註冊失敗，請稍後再試');
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

      <div style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
        <h1>註冊</h1>
        <input
          type="text"
          name="name"
          placeholder="姓名"
          value={formData.name}
          onChange={handleChange}
          style={{ height: '30px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="電子郵件"
          value={formData.email}
          onChange={handleChange}
          style={{ height: '30px' }}
        />
        <input
          type="text"
          name="phone"
          placeholder="手機號碼"
          value={formData.phone}
          onChange={handleChange}
          style={{ height: '30px' }}
        />
        <input
          type="password"
          name="password"
          placeholder="密碼"
          value={formData.password}
          onChange={handleChange}
          style={{ height: '30px' }}
        />
        <input
          type="date"
          name="birthday"
          value={formData.birthday}
          onChange={handleChange}
          style={{ height: '30px' }}
        />
        <input
          type="text"
          name="marketName"
          placeholder="賣場名稱"
          value={formData.marketName}
          onChange={handleChange}
          style={{ height: '30px' }}
        />
        <input
          type="text"
          name="marketAddress"
          placeholder="賣場地址"
          value={formData.marketAddress}
          onChange={handleChange}
          style={{ height: '30px' }}
        />
        <button
          onClick={handleRegister}
          style={{ height: '30px', marginTop: '15px', marginBottom: '15px' }}
        >
          註冊
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
