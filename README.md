# Timmy Market 線上商城網站

這是一個基於 React 前端與 Flask 後端的線上商城網站，作為資料庫課程的期末專案而開發。專案的主要功能包括管理產品、訂單，以及顧客與賣家的互動。以下是此專案的詳細介紹與技術架構，並附上 GitHub 專案連結與展示影片連結。

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
   如須測試，請使用連結的程式碼根據以下結構建立資料表並插入資料：[資料雲端](https://drive.google.com/drive/folders/1mN0sNwxAxP-5f2TIeePWi7wxW3nCJfKj?usp=sharing)

5. **設定資料庫密碼**  
   將資料庫密碼儲存在 `db_password.txt` 文件中，讓後端程式可以自動讀取。例如：
   ```plaintext
   password
   ```

6. **測試資料庫連線**  
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

- **展示影片連結**：[影片展示](https://youtu.be/zcsuNxNN8Mw?si=KR4fy5xa4pepJRx2)
- **書面報告**：[報告連結](https://drive.google.com/file/d/1D0jjMeWBBkmb9ZFhpiRPa2Pltwp4hhE5/view?usp=sharing)
