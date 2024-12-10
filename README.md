# Timmy Market 線上商城網站

這是一個基於 React 前端與 Flask 後端的線上商城網站，作為資料庫課程的期末專案而開發。專案的主要功能包括管理產品、訂單，以及顧客與賣家的互動。以下是此專案的詳細介紹與技術架構，並附上 GitHub 專案連結與展示影片連結。

## 目錄
- [專案簡介](#專案簡介)
- [功能簡介](#功能簡介)
- [技術架構](#技術架構)
- [如何執行](#如何執行)
- [系統設計與功能](#系統設計與功能)
- [影片與文件](#影片與文件)

## 專案簡介
隨著線上購物的趨勢越來越蓬勃，電子商務平台已經成為眾人消費的一個管道，本專案設計了一個名為「提米商城」的電子商務系統，讓買賣雙方可以在此進行線上交易，並提供各種便利的功能。

## 功能簡介
- **顧客功能**：
  - 瀏覽商品：使用者可以瀏覽各種商品，並查看詳細資料。
  - 加入購物車：顧客可以將商品加入購物車，並進行結帳。
  - 下訂單：顧客可以選擇付款方式並建立訂單。
  - 退貨與退款：顧客可以對已下訂單的商品申請退貨或退款。
  - 優惠券使用：顧客可以領取並使用優惠券以獲得折扣。

- **賣家功能**：
  - 上架商品：賣家可以上架商品，並管理商品庫存、價格與規格。
  - 管理訂單：賣家可以查看並處理訂單，並發送物流信息。
  - 發送優惠券：賣家可以發送優惠券來促進銷售。

- **管理者功能**：
  - 管理商品：管理者可以下架商品，刪除不當商品並處理商品信息。
  - 管理使用者：管理者可禁止不當使用者進行交易。
  - 查詢訂單物流：管理者可以查看訂單的物流狀態。

## 技術架構
- **前端**：使用 React 建立用戶界面，提供動態交互和流暢的使用者體驗。
- **後端**：使用 Flask 建立後端服務，處理 API 請求，並與 PostgreSQL 資料庫進行數據交互。
- **資料庫**：使用 PostgreSQL 作為資料庫，存儲商品、訂單、使用者資料等。
- **鎖控制**：使用 Python 的 `threading` 模組實現並發控制，防止資源競爭和重複操作，保證系統穩定運行。

## 專案結構

以下是專案的目錄結構以及功能簡述：

```
113-1_DB_FINAL/
│
├── backend/
│   ├── __pycache__/
│   ├── venv/
│   ├── app.py
│   ├── db_password.txt
│   ├── requirement.txt
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── robots.txt
│   │
│   ├── src/
│   │   ├── Card/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── YourCouponCard.jsx
│   │   │   ├── Rec/
│   │   │   │   ├── RecCouponCard.jsx
│   │   │   │   ├── RecProductCard.jsx
│   │   │   ├── Seller/
│   │   │   │   ├── CustomerOrder.jsx
│   │   │   │   ├── YourProductCard.jsx
│   │   │   ├── Card.css
│   │   │
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │
│   │   ├── Page/
│   │   │   ├── AdminPage.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── LikeProduct.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MarketPage.jsx
│   │   │   ├── YourMarket.jsx
│   │   │   ├── YourOrder.jsx
│   │   │   ├── Page.css
│   │   │
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── reportWebVitals.js
│   │   ├── setupTests.js
│   │
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│
├── backup and sql/
│   ├── db_final.backup
│   ├── create_table.sql
│   ├── insert_buyer_behavior.sql
│   ├── insert_cart.sql
│   ├── insert_coupon.sql
│   ├── insert_delivery.sql
│   ├── insert_market.sql
│   ├── insert_market_coupon.sql
│   ├── insert_order_product.sql
│   ├── insert_orders.sql
│   ├── insert_product.sql
│   ├── insert_users.sql
│   ├── README.md
│
├── README.md

```

## 如何執行

### 後端設置
1. **安裝虛擬環境**：
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # 在 macOS/Linux 上
   venv\Scripts\activate  # 在 Windows 上
   ```

2. **安裝所需套件**：
   ```bash
   pip install -r requirements.txt
   ```

3. **設定環境變數**：
   在專案根目錄下，創建 `.env` 文件，並設定如下內容：
   ```env
   FLASK_APP=app.py
   FLASK_ENV=development
   ```

4. **啟動後端服務**：
   ```bash
   flask run
   ```

### 前端設置
1. **安裝前端依賴**：
   在前端目錄中運行：
   ```bash
   npm install
   ```

2. **啟動前端開發服務**：
   ```bash
   npm start
   ``以下是依照你的格式撰寫的資料庫說明，適用於 README：

---

### 資料庫設置與運行

1. **安裝 PostgreSQL**  
   確保本地已安裝 PostgreSQL，並啟動伺服器。

2. **建立資料庫與使用者**  
   打開 PostgreSQL Shell 或使用資料庫管理工具（如 pgAdmin），執行以下指令來建立資料庫和使用者：  
   ```sql
   CREATE DATABASE database_name;
   CREATE USER username WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE database_name TO username;
   ```

3. **建立資料表**  
   根據以下結構建立資料表：  
   ```sql
   CREATE Table users (
	userid		varchar(10)	NOT NULL	PRIMARY KEY, 
	name		varchar(20)	NOT NULL,
	email		text		NOT NULL	UNIQUE,
	phone		char(10)	NOT NULL	UNIQUE,
	password	text		NOT NULL,
	birthday	date,
	state		varchar(10)	NOT NULL,
	CHECK (state IN ('Available', 'Restricted', 'Admin'))
	);

	CREATE Table market (
		userid		varchar(10)	NOT NULL	PRIMARY KEY,
		mname		text		NOT NULL,
		maddress	text		NOT NULL,
		CONSTRAINT fk_market FOREIGN KEY (userid) REFERENCES users(userid)
			ON DELETE CASCADE
			ON UPDATE CASCADE
	);

	CREATE Table product (
		productid	varchar(10)	NOT NULL	PRIMARY KEY,
		pname		text		NOT NULL,
		price		int			NOT NULL,
		sellerid	varchar(10)	NOT NULL,
		storage		int			NOT NULL,
		period		int			NOT NULL,
		state		varchar(10)	NOT NULL	DEFAULT 'Available',
		size		char(1)		NOT NULL	DEFAULT 'F',
		color		varchar(15)	NOT NULL,
		CONSTRAINT fk_seller FOREIGN KEY (sellerid) REFERENCES market(userid)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		CHECK (state IN ('Available', 'Removed', 'Sold-out', 'Restricted')),
		CHECK (size IN ('S', 'M', 'L', 'F'))
	);

	CREATE Table coupon (
		couponid	varchar(10)	NOT NULL	PRIMARY KEY,
		content		text		NOT NULL,
		condition	text		NOT NULL,
		start_date	date		NOT NULL,
		end_date	date		NOT NULL,
		CHECK (end_date >= start_date)
	);

	CREATE Table cart (
		userid		varchar(10)	NOT NULL,
		productid	varchar(10)	NOT NULL,
		quantity	int			NOT NULL	DEFAULT 1,
		PRIMARY KEY (userid, productid),
		CONSTRAINT fk_cart_user FOREIGN KEY (userid) REFERENCES users(userid)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		CONSTRAINT fk_product FOREIGN KEY (productid) REFERENCES product(productid)
			ON DELETE CASCADE
			ON UPDATE CASCADE
	);

	CREATE Table orders (
		orderid		varchar(10)	NOT NULL	PRIMARY KEY,
		otime		timestamp	NOT NULL,
		buyerid		varchar(10)	NOT NULL,
		sellerid	varchar(10)	NOT NULL,
		amount		int			NOT NULL,
		method		varchar(20)	NOT NULL,
		state		varchar(20)	NOT NULL,
		review		text,
		couponid	varchar(10),
		CONSTRAINT fk_order_buyer FOREIGN KEY (buyerid) REFERENCES users(userid)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		CONSTRAINT fk_order_seller FOREIGN KEY (sellerid) REFERENCES market(userid)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		CONSTRAINT fk_order_coupon FOREIGN KEY (couponid) REFERENCES coupon(couponid)
			ON DELETE SET NULL
			ON UPDATE CASCADE,
		CHECK (state IN ('Waiting', 'Confirmed', 'Processing', 'Finished', 'CancelWaiting', 'Canceled')),
		CHECK (method IN ('Cash', 'LinePay', 'CreditCard'))
	);

	CREATE Table market_coupon (
		userid		varchar(10)	NOT NULL,
		couponid	varchar(10)	NOT NULL,
		quantity	int			NOT NULL,
		PRIMARY KEY(userid, couponid),
		CONSTRAINT fk_market_coupon_user FOREIGN KEY (userid) REFERENCES market(userid)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		CONSTRAINT fk_market_coupon_couponid FOREIGN KEY (couponid) REFERENCES coupon(couponid)
			ON DELETE CASCADE
			ON UPDATE CASCADE
	);

	CREATE Table order_product (
		orderid		varchar(10)	NOT NULL,
		productid	varchar(10)	NOT NULL,
		quantity	int			NOT NULL	DEFAULT 1,
		PRIMARY KEY(orderid, productid),
		CONSTRAINT fk_order FOREIGN KEY (orderid) REFERENCES orders(orderid)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		CONSTRAINT fk_order_product FOREIGN KEY (productid) REFERENCES product(productid)
			ON DELETE CASCADE
			ON UPDATE CASCADE
	);

	CREATE Table delivery (
		orderid			varchar(10)		NOT NULL	PRIMARY KEY,
		dmethod  			varchar(20) 	NOT NULL 	DEFAULT 	'Standard-Shipping',
		fee   				int   			NOT NULL,
		start_date 		date  			NOT NULL,
		end_date 			date  			NOT NULL,
		start_station_add 	text 			NOT NULL,
		end_station_add  	text 			NOT NULL,
		state  			varchar(20) 	NOT NULL,
		CONSTRAINT fk_delivery FOREIGN KEY (orderid) REFERENCES orders(orderid)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		CONSTRAINT fk_start_add FOREIGN KEY (start_station_add) REFERENCES MARKET(maddress)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		CHECK (dmethod IN ('Standard-Shipping', 'Express-Shipping')),
		CHECK (state IN ('Shipping', 'Complete', 'Request-Return', 'Returned')),
		CHECK (end_date >= start_date)
	);

	CREATE Table buyer_behavior (
		userid		varchar(10)	NOT NULL,
		productid	varchar(10)	NOT NULL,
		behavior	varchar(20)	NOT NULL,
		time		timestamp	NOT NULL,
		PRIMARY KEY (userid, productid),
		CONSTRAINT fk_behavior_user FOREIGN KEY (userid) REFERENCES users(userid)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		CONSTRAINT fk_behavior_product FOREIGN KEY (productid) REFERENCES product(productid)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		CHECK (behavior IN ('Favorite', 'Not-Interested', 'Browsed', 'Report'))
	);
   ```
   如須測試，請使用連結的程式碼插入資料：[資料雲端](https://drive.google.com/drive/folders/1mN0sNwxAxP-5f2TIeePWi7wxW3nCJfKj?usp=sharing)

4. **設定資料庫密碼**  
   將資料庫密碼儲存在 `db_password.txt` 文件中，讓後端程式可以自動讀取。例如：
   ```plaintext
   password
   ```

5. **測試資料庫連線**  
   使用本地的 PostgreSQL 客戶端工具（如 pgAdmin 或 TablePlus）進行連線測試，確認資料庫可以正常使用。


## 系統設計與功能

此系統提供完整的電子商務流程，從商品瀏覽、購物車管理到訂單處理，涵蓋了顧客與賣家的互動需求。系統中的資料庫設計確保了商品與訂單資料的一致性，並使用鎖機制來防止並發問題，保證交易過程的穩定性。

### 資料庫設計
- **商品資料表**：存儲商品的名稱、描述、價格、庫存等。
- **訂單資料表**：存儲顧客的訂單詳情，包括訂單狀態、支付方式、配送地址等。
- **用戶資料表**：儲存顧客與賣家的基本資訊，如帳號、密碼、聯繫方式等。

### 鎖控制
為防止並發交易導致的重複操作或資料不一致問題，本系統使用 `threading.Lock()` 進行鎖控制。系統使用兩個鎖來分別處理商品和優惠券的併發控制，確保在處理商品訂單或優惠券發放時不會發生衝突。

## 影片與文件

- **GitHub 專案連結**：[GitHub Repository](https://github.com/yourusername/timmy-market)
- **展示影片連結**：[影片展示](https://youtu.be/yourvideolink)

這些資源展示了專案的完整功能與操作流程，您可以進一步了解系統如何運作，並查看實際的操作界面與功能演示。

---
