import { useEffect, useState } from 'react';

function AdminPage() {
  const [reportedProducts, setReportedProducts] = useState([]);
  const [reportedUsers, setReportedUsers] = useState([]);
  const [blockedProducts, setBlockedProducts] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [productPage, setProductPage] = useState(1);
  const [userPage, setUserPage] = useState(1);

  const ITEMS_PER_PAGE = 30;
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

  // 取消檢舉商品
  const unreportProduct = async (id) => {
    const response = await fetch(`${baseUrl}/unreport_product`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: id }),
    });
    const data = await response.json();
    if (data.status === 'success') {
      setReportedProducts((prev) => prev.filter((product) => product.id !== id));
      alert(data.message);
    }
  };

  // 封鎖商品
  const blockProduct = async (id) => {
    const response = await fetch(`${baseUrl}/block_product`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: id }),
    });
    const data = await response.json();
    if (data.status === 'success') {
      const product = reportedProducts.find((p) => p.id === id);
      setReportedProducts((prev) => prev.filter((product) => product.id !== id));
      setBlockedProducts((prev) => [product, ...prev]);
      alert(data.message);
    }
  };

  // 取消檢舉使用者
  const unreportUser = async (id) => {
    const response = await fetch(`${baseUrl}/unreport_user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: id }),
    });
    const data = await response.json();
    if (data.status === 'success') {
      setReportedUsers((prev) => prev.filter((user) => user.id !== id));
      alert(data.message);
    }
  };

  // 封鎖使用者
  const blockUser = async (id) => {
    const response = await fetch(`${baseUrl}/block_user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: id }),
    });
    const data = await response.json();
    if (data.status === 'success') {
      const user = reportedUsers.find((u) => u.id === id);
      setReportedUsers((prev) => prev.filter((user) => user.id !== id));
      setBlockedUsers((prev) => [user, ...prev]);
      alert(data.message);
    }
  };

  // 分頁處理
  const paginate = (items, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const blockedProductsPage = paginate(blockedProducts, productPage);
  const blockedUsersPage = paginate(blockedUsers, userPage);

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
              <button onClick={() => blockProduct(product.productid)}>封鎖商品</button>
              <button onClick={() => blockUser(product.productid)}>封鎖使用者</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>目前沒有被檢舉的商品。</p>
      )}

      {/* 封鎖商品 */}
      <h2>封鎖的商品</h2>
      {blockedProducts.length > 0 ? (
        <div>
          <ul>
            {blockedProductsPage.map((product) => (
              <li key={product.id}>
                <strong>{product.name}</strong>
              </li>
            ))}
          </ul>
          <div>
            <button
              disabled={productPage === 1}
              onClick={() => setProductPage((prev) => prev - 1)}
            >
              上一頁
            </button>
            <button
              disabled={productPage * ITEMS_PER_PAGE >= blockedProducts.length}
              onClick={() => setProductPage((prev) => prev + 1)}
            >
              下一頁
            </button>
          </div>
        </div>
      ) : (
        <p>目前沒有封鎖的商品。</p>
      )}

      {/* 封鎖使用者 */}
      <h2>封鎖的使用者</h2>
      {blockedUsers.length > 0 ? (
        <div>
          <ul>
            {blockedUsersPage.map((user) => (
              <li key={user.id}>
                <strong>{user.username}</strong>
              </li>
            ))}
          </ul>
          <div>
            <button
              disabled={userPage === 1}
              onClick={() => setUserPage((prev) => prev - 1)}
            >
              上一頁
            </button>
            <button
              disabled={userPage * ITEMS_PER_PAGE >= blockedUsers.length}
              onClick={() => setUserPage((prev) => prev + 1)}
            >
              下一頁
            </button>
          </div>
        </div>
      ) : (
        <p>目前沒有封鎖的使用者。</p>
      )}
    </div>
  );
}

export default AdminPage;
