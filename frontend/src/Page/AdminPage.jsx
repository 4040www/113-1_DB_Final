import { useEffect, useState } from 'react';

function AdminPage() {
  const [reportedProducts, setReportedProducts] = useState([]);
  const [reportedUsers, setReportedUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);

  const baseUrl = `http://localhost:${window.globalPort}`;

  // 獲取被檢舉商品
  const fetchReportedProducts = async () => {
    const response = await fetch(`${baseUrl}/get_reported_products`);
    const data = await response.json();
    console.log(data);
    setReportedProducts(data.data);
  };

  useEffect(() => {
    fetchReportedProducts();
  }, []);

  // 獲取被檢舉使用者
  const fetchReportedUsers = async () => {
    const response = await fetch(`${baseUrl}/get_restricted_users`);
    const data = await response.json();
    console.log(data);
    setReportedUsers(data.data);
  };

  useEffect(() => {
    fetchReportedUsers();
  }, []);

  // 取消檢舉商品
  const unreportProduct = async (id) => {
    const response = await fetch(`${baseUrl}/unreport_product?productId=${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (data.status === 'success') {
      alert("取消檢舉成功！");
      fetchReportedProducts();
    }
  };

  // 封鎖使用者
  const blockUser = async (id) => {
    const response = await fetch(`${baseUrl}/block_user?userId=${id}`, {
      method: 'PUT',
    });
    const data = await response.json();
    if (data.status === 'success') {
      fetchReportedUsers();
      fetchReportedProducts();
      alert("封鎖成功！");
    }
  };

  // 取消檢舉使用者
  const unblockUser = async (id) => {
    const response = await fetch(`${baseUrl}/unblock_user?userId=${id}`, {
      method: 'PUT'
    });
    const data = await response.json();
    if (data.status === 'success') {
      fetchReportedUsers();
      alert("取消封鎖成功！");
    }
  };

  return (
    <div>
      <h1>管理員介面</h1>
      <p>歡迎來到管理員專屬頁面！</p>

      <h2>被檢舉商品</h2>
      {reportedProducts.length > 0 ? (
        <ul>
          {reportedProducts.map((product) => (
            <li key={product.id}>
              <strong>{product.product_name}</strong> - {product.seller_name}
              <button onClick={() => unreportProduct(product.productid)}>取消檢舉</button>
              <button onClick={() => blockUser(product.sellerid)}>封鎖使用者</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>目前沒有被檢舉的商品。</p>
      )}

      <h2>封鎖的使用者</h2>
      {reportedUsers.length > 0 ? (
        <div>
          <ul>
            {reportedUsers.map((user) => (
              <li key={user.userid}>
                <strong>{user.name}</strong>
                <p>ID:{user.userid}</p>
                <p>EMAIL:{user.email}</p>
                <p>PHONE:{user.phone}</p>
                <p>BIRTHDAY:{new Date(user.birthday).toLocaleDateString()}</p>
                <button onClick={() => unblockUser(user.userid)}>取消封鎖</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>目前沒有封鎖的使用者。</p>
      )}
    </div>
  );
}

export default AdminPage;
