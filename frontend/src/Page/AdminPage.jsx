import { useEffect, useState } from 'react';

function AdminPage() {
  const [reportedProducts, setReportedProducts] = useState([]);
  const [reportedUsers, setReportedUsers] = useState([]);
  const [orderInfo, setOrderInfo] = useState([]);
  const [status, setStatus] = useState("buyerid"); // 用於儲存 select 的值
  const [inputValue, setInputValue] = useState(""); // 用於儲存 input 的值
  const [changeState, setChangeState] = useState("Confirmed");

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

  // 獲得訂單資訊
  const fetchOrderInfo = async (status, value) => {
    const response = await fetch(`${baseUrl}/get_order_info?status=${status}&value=${value}`);
    const data = await response.json();
    console.log(data);
    setOrderInfo(data.data);
  } 

  // 搜尋訂單
  const handleSearch = () => {
    console.log(status, inputValue);
    fetchOrderInfo(inputValue, status);
  };

  const handleChangeOrderState = async (orderId, behavior) => {
    try {
      const response = await fetch(`http://localhost:${window.globalPort}/change_order_state?orderId=${orderId}&behavior=${behavior}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to refund order');

      alert('Sending order state change request...');
      fetchOrderInfo( inputValue, status);
    } catch (err) {
      console.error('Error refunding order:', err);
      alert('Failed to refund order. Please try again.');
    }
  };

  return (
    <div>
      <h1>管理員介面</h1>
      <p>歡迎來到管理員專屬頁面！</p>

      <h2>搜尋訂單以管理物流</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* 下拉選單 */}
        <select
          name="status"
          id="status"
          onChange={(e) => setStatus(e.target.value)}
          style={{ height: '30px' }}
          value={status}
        >
          <option value="buyerid">買家</option>
          <option value="sellerid">賣家</option>
          <option value="orderid">訂單編號</option>
          <option value="state">訂單狀態</option>
        </select>

        {/* 輸入框 */}
        <input
          type="text"
          placeholder="請輸入訂單資訊"
          style={{ height: '24px' }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        {/* 按鈕 */}
        <button onClick={handleSearch} style={{ height: '30px' }}>
          搜尋
        </button>
      </div>
      <ul>
          {orderInfo.map((order) => (
            <li key={order.id}>
              <strong>{order.orderid}</strong> - Buyer:{order.buyerid} - Seller:{order.sellerid}
              <p>State:{order.state}</p>
              <p>Price:${order.amount}</p>
              <p>Date:{new Date(order.otime).toLocaleDateString()}</p>
              <p>method:{order.method}</p>
              <select
                value={changeState}
                onChange={(e) => setChangeState(e.target.value)}
                style={{ height: '30px' }}
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Finished">Finished</option>
                <option value="CancelWaiting">CancelWaiting</option>
                <option value="Canceled">Canceled</option>
              </select>
              <button onClick={() => handleChangeOrderState(order.orderid, changeState )} style={{ height: '30px', marginLeft:'10px' }}>更改訂單狀態</button>
            </li>
          ))}
        </ul>

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
              <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                <strong>{user.name}</strong>
                <p>ID:{user.userid}</p>
                <p>EMAIL:{user.email}</p>
                <p>PHONE:{user.phone}</p>
                <p>BIRTHDAY:{new Date(user.birthday).toLocaleDateString()}</p>
                <button onClick={() => unblockUser(user.userid)} style={{ height: '30px' }} >取消封鎖</button>
              </div>
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
