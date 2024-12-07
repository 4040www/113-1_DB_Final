# Timmy Market 線上商城網站

這是一個基於 React 前端與 Flask 後端的線上商城網站，為資料庫課程的期末專案而開發。專案的主要功能包括管理產品、訂單，以及顧客與賣家的互動。

## 功能簡介
- 顧客可以瀏覽商品、加入購物車並下訂單。
- 賣家可以上架商品、管理庫存和查看訂單。
- 支援推薦功能，為顧客推薦商品與優惠券。

## 技術架構
- **前端**：使用 React 來構建用戶界面，提供動態交互和流暢的使用者體驗。
- **後端**：使用 Flask 來處理 API 請求，並與 PostgreSQL 數據庫進行數據交互。
- **資料庫**：使用 PostgreSQL 存儲用戶、訂單、商品等數據。

---

## 專案結構

以下是專案的目錄結構以及功能簡述：

```
113-1_DB_FINAL/
├── public/                      # 靜態資源文件
│   ├── favicon.ico              # 項目圖標
│   ├── index.html               # 主 HTML 文件
│   ├── manifest.json            # PWA 設置文件
│   ├── robots.txt               # SEO 文件
├── src/                         # 源碼文件
│   ├── Card/                    # 卡片相關的元件
│   │   ├── Card/                # 通用卡片元件
│   │   │   ├── ProductCard.jsx  # 商品卡片元件
│   │   │   ├── YourCouponCard.jsx # 優惠券卡片元件
│   │   ├── Rec/                 # 推薦相關元件
│   │   │   ├── RecCouponCard.jsx # 推薦優惠券元件
│   │   │   ├── RecProductCard.jsx # 推薦商品元件
│   │   ├── Seller/              # 賣家專用元件
│   │       ├── CustomerOrder.jsx # 顯示顧客訂單
│   │       ├── YourProductCard.jsx # 賣家商品卡片
│   ├── Page/                    # 頁面元件
│   │   ├── Cart.jsx             # 購物車頁面
│   │   ├── MarketPage.jsx       # 市場頁面
│   │   ├── YourOrder.jsx        # 顧客訂單頁面
│   │   ├── YourMarket.jsx       # 賣家管理頁面
│   │   ├── Page.css             # 頁面樣式
│   ├── App.js                   # 主應用程式入口
│   ├── App.css                  # 全局樣式
│   ├── index.js                 # ReactDOM 渲染入口
│   ├── index.css                # 主 CSS
│   ├── reportWebVitals.js       # 性能測試
│   ├── setupTests.js            # 測試設置
├── .gitignore                   # Git 忽略文件
├── package.json                 # 項目依賴與腳本
├── README.md                    # 項目說明文件
```

---

## 如何啟動專案

以下是啟動該專案的詳細步驟：

1. 確保您已安裝 [Node.js](https://nodejs.org/) 與 npm（或 yarn）。

2. **克隆專案到本地**：
   ```bash
   git clone <你的倉庫網址>
   cd 113-1_DB_FINAL
   ```

3. **安裝相依套件**：
   ```bash
   npm install
   ```

4. **啟動開發伺服器**：
   ```bash
   npm start
   ```

5. 在瀏覽器中開啟 [http://localhost:3000](http://localhost:3000) 即可查看網站。

---

## 預覽畫面
如果您有項目預覽圖片，可以在此處附加。

---

## 貢獻者
- [陳庭宇]()  
- [毛羚芳]()  
- [陳詣斌](https://github.com/4040www)  


---

如果需要任何其他修改或添加，隨時告訴我！

以下是根据您的要求修改后的 `README.md` 文件，包含了前端是 React，后端是 Flask 和 PostgreSQL 的描述：

# Timmy Market 線上商城網站

這是一個基於 React 前端與 Flask 後端的線上商城網站，為資料庫課程的期末專案而開發。專案的主要功能包括管理產品、訂單，以及顧客與賣家的互動。

## 功能簡介
- 顧客可以瀏覽商品、加入購物車並下訂單。
- 賣家可以上架商品、管理庫存和查看訂單。
- 支援推薦功能，為顧客推薦商品與優惠券。

## 技術架構
- **前端**：使用 React 來構建用戶界面，提供動態交互和流暢的使用者體驗。
- **後端**：使用 Flask 來處理 API 請求，並與 PostgreSQL 數據庫進行數據交互。
- **資料庫**：使用 PostgreSQL 存儲用戶、訂單、商品等數據。

---

## 專案結構

以下是專案的目錄結構以及功能簡述：

```
113-1_DB_FINAL/
├── public/                      # 靜態資源文件
│   ├── favicon.ico              # 項目圖標
│   ├── index.html               # 主 HTML 文件
│   ├── manifest.json            # PWA 設置文件
│   ├── robots.txt               # SEO 文件
├── src/                         # 前端源碼文件
│   ├── Card/                    # 卡片相關的元件
│   │   ├── Card/                # 通用卡片元件
│   │   │   ├── ProductCard.jsx  # 商品卡片元件
│   │   │   ├── YourCouponCard.jsx # 優惠券卡片元件
│   │   ├── Rec/                 # 推薦相關元件
│   │   │   ├── RecCouponCard.jsx # 推薦優惠券元件
│   │   │   ├── RecProductCard.jsx # 推薦商品元件
│   │   ├── Seller/              # 賣家專用元件
│   │       ├── CustomerOrder.jsx # 顯示顧客訂單
│   │       ├── YourProductCard.jsx # 賣家商品卡片
│   ├── Page/                    # 頁面元件
│   │   ├── Cart.jsx             # 購物車頁面
│   │   ├── MarketPage.jsx       # 市場頁面
│   │   ├── YourOrder.jsx        # 顧客訂單頁面
│   │   ├── YourMarket.jsx       # 賣家管理頁面
│   │   ├── Page.css             # 頁面樣式
│   ├── App.js                   # 主應用程式入口
│   ├── App.css                  # 全局樣式
│   ├── index.js                 # ReactDOM 渲染入口
│   ├── index.css                # 主 CSS
│   ├── reportWebVitals.js       # 性能測試
│   ├── setupTests.js            # 測試設置
├── backend/                     # 後端源碼文件
│   ├── app.py                   # Flask 後端應用程式
│   ├── db_password.txt          # PostgreSQL 密碼文件
│   ├── requirements.txt         # Python 依賴項
├── .gitignore                   # Git 忽略文件
├── package.json                 # 前端項目依賴與腳本
├── README.md                    # 項目說明文件
```

---

## 如何啟動專案

### 前端部分

1. 確保您已安裝 [Node.js](https://nodejs.org/) 與 npm（或 yarn）。

2. **克隆專案到本地**：
   ```bash
   git clone <你的倉庫網址>
   cd 113-1_DB_FINAL
   ```
3. **安裝相依套件**：
   ```bash
   npm install
   ```
4. **啟動前端開發伺服器**：
   ```bash
   npm start
   ```
5. 在瀏覽器中開啟 [http://localhost:3000](http://localhost:3000) 即可查看前端頁面。

### 後端部分
1. 確保您已安裝 [Python 3.x](https://www.python.org/downloads/)，並且已經安裝了必要的 Python 套件。
2. **安裝後端依賴**：
   進入 `backend` 目錄並安裝依賴：
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. **啟動後端伺服器**：
   ```bash
   python3 app.py
   ```
4. 後端服務將運行於 `http://127.0.0.1:5000`，API 端點也會在這裡提供。

---

## 預覽畫面
如果您有項目預覽圖片，可以在此處附加。

---

## 貢獻者
- [陳庭宇]()  
- [毛羚芳]()  
- [陳詣斌](https://github.com/4040www)  

---

## 註解
- 如果需要其他修改或新增功能，請隨時聯繫我們。
- 如果您有任何問題，請查閱我們的文檔或聯繫專案的貢獻者。

```

debug area:

1. 
購物車應該需要兩個 pk 在後面新增數量的時候會比較好 不然太多重疊的？
ALTER TABLE cart
ADD CONSTRAINT unique_cart UNIQUE (userid, productid);

2.
購物車應該需要兩個 pk 在後面新增數量的時候會比較好 不然太多重疊的？
ALTER TABLE cart DROP CONSTRAINT cart_pkey;
ALTER TABLE cart ADD PRIMARY KEY (userid, productid);

3.
*需要補上
Not-Interested
在拿商品資料時 要把沒有興趣的挑掉

4.
user behavior 
要多一個 'report'
DROP TABLE IF EXISTS buyer_behavior;
CREATE TABLE buyer_behavior (
    userid      VARCHAR(10) NOT NULL,
    productid   VARCHAR(10) NOT NULL,
    behavior    VARCHAR(20) NOT NULL,
    time        TIMESTAMP NOT NULL,
    PRIMARY KEY (userid, productid),
    CONSTRAINT fk_behavior_user FOREIGN KEY (userid) REFERENCES users(userid)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_behavior_product FOREIGN KEY (productid) REFERENCES product(productid)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CHECK (behavior IN ('Favorite', 'Not-Interested', 'Browsed', 'Report'))
);

5.
需要多一個地方看消費者檢舉的東西

6.
賣家需要一個地方紀錄他的運送起始點

7.
訂單費用、付款方式要加（購物車的流程要看一下）下單商品數量會簡少的也要做...

8.
全部的 UI 有時間可以變好看...（沒有時間了...）

9.
運送費用

10.
State 訂單狀態 varchar (20) Not Null {Confirm, Processing, Cancel}
代表的是 確認訂單、取消訂單確認中、已被取消
可能改成 {Waiting, Confirmed, Processing, Finished, CancelWaiting, Canceled} 會比較好
（等待賣家確認、賣家確認訂單、訂單商品運送中、訂單完成、買家申請取消訂單 等待賣家確認、確認訂單已被取消）

11.
<<<<<<< HEAD
喜歡的商品加入購物車後要刪除？

12.
port 要說明前後端都要改

13.
不能買自己的東西（不會顯示自己的商品）

14.
下訂單的優惠券

15.
如果註冊重複 不會跳通知
=======
喜歡的商品加入購物車後要刪除？（毛覺得不用！）
>>>>>>> f93509ece78a8516a1ab309c10a6cad755a20c8a
