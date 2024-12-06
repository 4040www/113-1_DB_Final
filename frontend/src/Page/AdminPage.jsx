import { useEffect, useState } from 'react';

function AdminPage() {
  const [reportedProducts, setReportedProducts] = useState([]);
  const [reportedUsers, setReportedUsers] = useState([]);
  const [blockedProducts, setBlockedProducts] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [productPage, setProductPage] = useState(1);
  const [userPage, setUserPage] = useState(1);

  const ITEMS_PER_PAGE = 30;

  // 模擬獲取資料
  useEffect(() => {
    // TODO: 使用 API 獲取資料
    setReportedProducts([
      { id: 1, name: 'Product A', reason: 'Fake product' },
      { id: 2, name: 'Product B', reason: 'Inappropriate content' },
      // 添加更多測試資料
    ]);

    setReportedUsers([
      { id: 1, username: 'User123', reason: 'Spam messages' },
      { id: 2, username: 'User456', reason: 'Harassment' },
      // 添加更多測試資料
    ]);
  }, []);

  // 刪除商品
  const deleteProduct = (id) => {
    setReportedProducts((prev) => prev.filter((product) => product.id !== id));
    alert(`商品 ID: ${id} 已被刪除`);
  };

  // 封鎖商品
  const blockProduct = (id) => {
    const product = reportedProducts.find((p) => p.id === id);
    setReportedProducts((prev) => prev.filter((product) => product.id !== id));
    setBlockedProducts((prev) => [product, ...prev]);
  };

  // 刪除使用者
  const deleteUser = (id) => {
    setReportedUsers((prev) => prev.filter((user) => user.id !== id));
    alert(`使用者 ID: ${id} 已被刪除`);
  };

  // 封鎖使用者
  const blockUser = (id) => {
    const user = reportedUsers.find((u) => u.id === id);
    setReportedUsers((prev) => prev.filter((user) => user.id !== id));
    setBlockedUsers((prev) => [user, ...prev]);
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

      {/* 被檢舉商品 */}
      <h2>被檢舉商品</h2>
      {reportedProducts.length > 0 ? (
        <ul>
          {reportedProducts.map((product) => (
            <li key={product.id}>
              <strong>{product.name}</strong> - {product.reason}
              <button onClick={() => deleteProduct(product.id)}>刪除</button>
              <button onClick={() => blockProduct(product.id)}>封鎖</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>目前沒有被檢舉的商品。</p>
      )}

      {/* 被檢舉使用者 */}
      <h2>被檢舉使用者</h2>
      {reportedUsers.length > 0 ? (
        <ul>
          {reportedUsers.map((user) => (
            <li key={user.id}>
              <strong>{user.username}</strong> - {user.reason}
              <button onClick={() => deleteUser(user.id)}>刪除</button>
              <button onClick={() => blockUser(user.id)}>封鎖</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>目前沒有被檢舉的使用者。</p>
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
