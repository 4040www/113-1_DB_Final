import time
from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import pool
from flask_cors import CORS
import secrets
import string

import threading

global_lock = threading.Lock()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# 讀取資料庫密碼
with open('db_password.txt', 'r') as file:
    db_password = file.read().strip()

# 建立 PostgreSQL 連線池
psql_pool = psycopg2.pool.SimpleConnectionPool(1, 20, f"dbname='' user='postgres' host='localhost' password={db_password}")

# 工具函數：取得連線
def get_psql_connection():
    try:
        return psql_pool.getconn()
    except Exception as e:
        print(f"Error getting connection from pool: {e}")
        return None

# 工具函數：釋放連線
def release_psql_connection(conn):
    if conn:
        psql_pool.putconn(conn)

# 通用查詢函數
def execute_query(query, params=None, fetch=True, use_transaction=False):
    conn = get_psql_connection()
    if not conn:
        return {"status": "error", "message": "Database connection failed"}

    try:
        if use_transaction:
            conn.autocommit = False  # 關閉自動提交，手動控制交易

        with conn.cursor() as cursor:
            cursor.execute(query, params)
            if fetch:
                rows = cursor.fetchall()
                columns = [desc[0] for desc in cursor.description]
                return {"status": "success", "data": [dict(zip(columns, row)) for row in rows]}
            else:
                if not use_transaction:  # 非交易模式下立即提交
                    conn.commit()
                return {"status": "success"}
    except Exception as e:
        if use_transaction:
            conn.rollback()  # 若使用交易模式，出現錯誤時回滾
        print(f"Error executing query: {e}")
        return {"status": "error", "message": str(e)}
    finally:
        if use_transaction:
            conn.commit()  # 成功執行所有操作後提交交易
        release_psql_connection(conn)


# -----------------------------
# API 定義
# -----------------------------

# --- GET ----------------------

# 登入
@app.route('/get_user_login_info', methods=['GET'])
def get_user_login_info():
    email = request.args.get('email')
    if email:
        result = execute_query("SELECT * FROM users WHERE email = %s", (email,))
        return jsonify(result)
    return jsonify({"status": "error", "message": "Missing email parameter"}), 400

# 使用者資料
@app.route('/get_user_info', methods=['GET'])
def get_user_info():
    userid = request.args.get('userid')
    if userid:
        result = execute_query("SELECT * FROM users WHERE userid = %s", (userid,))
        return jsonify(result)
    return jsonify({"status": "error", "message": "Missing userid parameter"}), 400


# 產品資料
@app.route('/get_product', methods=['GET'])
def get_product():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({"status": "error", "message": "Missing userId"}), 400

    query = """
        SELECT 
            p.*, 
            m.mname AS market_name     
        FROM product p
        JOIN market m ON p.sellerid = m.userid
        WHERE p.sellerid != %s and p.state = 'Available'
    """
    result = execute_query(query, (user_id,))
    return jsonify(result)


# 獲得自己的商品
@app.route('/get_product_mine', methods=['GET'])
def get_product_mine():
    user_id = request.args.get('userid')
    if not user_id:
        return jsonify({"status": "error", "message": "Missing userid"}), 400

    query = """
        SELECT 
            p.*, 
            m.mname AS market_name     
        FROM product p
        JOIN market m ON p.sellerid = m.userid
        WHERE p.sellerid = %s
    """
    result = execute_query(query, (user_id,))
    return jsonify(result)

# 購物車資料
@app.route('/get_cart', methods=['GET'])
def get_cart():
    user_id = request.args.get('userid')
    if not user_id:
        return jsonify({"status": "error", "message": "Missing userid"}), 400

    query = """
        SELECT 
            c.productid,
            c.quantity,
            p.pname AS product_name,
            p.price,
            p.sellerid,
            m.mname AS seller_name,
            m.maddress AS seller_address
        FROM cart c
        JOIN product p ON c.productid = p.productid
        JOIN users u ON p.sellerid = u.userid
        JOIN market m ON p.sellerid = m.userid
        WHERE c.userid = %s
    """
    result = execute_query(query, (user_id,))
    return jsonify(result)

# 獲得可用優惠券
@app.route('/get_coupon', methods=['GET'])
def get_coupon():
    seller_id = request.args.get('sellerid')
    if not seller_id:
        return jsonify({"status": "error", "message": "Missing userid"}), 400

    query = """
        SELECT 
            C.couponid, 
            C.content, 
            C.condition, 
            C.start_date, 
            C.end_date, 
            MC.quantity
        FROM coupon AS C
        JOIN market_coupon AS MC ON C.couponid = MC.couponid
        WHERE MC.userid = %s
    """
    result = execute_query(query, (seller_id,))
    return jsonify(result)

# 優惠券資料
@app.route('/recommend_coupon', methods=['GET'])
def recommend_coupon():
    query = """
        SELECT C.content, C.condition, M.mname
        FROM coupon AS C
        JOIN market_coupon AS MC ON C.couponid = MC.couponid
        JOIN market AS M ON MC.userid = M.userid
        ORDER BY RANDOM()
        LIMIT 6
    """
    result = execute_query(query)
    return jsonify(result)

# 獲得自己的優惠券
@app.route('/get_coupon_mine', methods=['GET'])
def get_coupon_mine():
    user_id = request.args.get('userid')
    if not user_id:
        return jsonify({"status": "error", "message": "Missing userid"}), 400

    query = """
        SELECT C.couponid, C.content, C.condition, C.start_date, C.end_date, MC.quantity
        FROM coupon AS C
        JOIN market_coupon AS MC ON C.couponid = MC.couponid
        WHERE MC.userid = %s
    """
    result = execute_query(query, (user_id,))
    return jsonify(result)

# 使用者行為紀錄
@app.route('/get_user_behavior', methods=['GET'])
def get_user_behavior():
    user_id = request.args.get('userid')
    behavior = request.args.get('behavior', 'Favorite')  # Default behavior to 'Favorite'
    
    if not user_id:
        return jsonify({"status": "error", "message": "Missing userid"}), 400

    # Add a check for behavior, defaulting to 'Favorite' if not provided
    query = """
        SELECT 
            bb.productid, 
            bb.behavior, 
            p.pname AS product_name,
            p.price,
            p.sellerid,
            m.mname AS seller_name
        FROM buyer_behavior bb
        JOIN product p ON bb.productid = p.productid
        JOIN market m ON p.sellerid = m.userid
        WHERE bb.userid = %s AND bb.behavior = %s
    """
    result = execute_query(query, (user_id, behavior))
    return jsonify(result)

# 訂單資料
@app.route('/get_order', methods=['GET'])
def get_order():
    user_id = request.args.get('userid')
    if not user_id:
        return jsonify({"status": "error", "message": "Missing userid"}), 400

    # 查詢訂單資料
    query = """
        SELECT 
            o.orderid,
            o.otime,
            o.amount,
            o.method,
            o.state,
            d.start_station_add,
            d.end_station_add
        FROM orders o
        JOIN delivery d ON o.orderid = d.orderid
        WHERE o.buyerid = %s
    """
    result = execute_query(query, (user_id,))
    if result["status"] == "error":
        return jsonify(result), 500

    orders = result.get("data", [])

    # 查詢每個訂單的商品資料
    for order in orders:
        order_id = order['orderid']
        query_products = """
            SELECT 
                op.productid,
                op.quantity,
                p.pname AS product_name,
                p.price,
                p.sellerid,
                m.mname AS seller_name
            FROM order_product op
            JOIN product p ON op.productid = p.productid
            JOIN market m ON p.sellerid = m.userid
            WHERE op.orderid = %s
        """
        product_result = execute_query(query_products, (order_id,))
        if product_result["status"] == "error":
            return jsonify(product_result), 500

        order['products'] = product_result.get("data", [])  # Add products to each order

    return jsonify({"status": "success", "data": orders})

# 訂單商品資料
@app.route('/get_order_product', methods=['GET'])
def get_order_product():
    order_id = request.args.get('orderid')
    if not order_id:
        return jsonify({"status": "error", "message": "Missing orderid"}), 400

    query = """
        SELECT 
            op.productid,
            op.quantity,
            p.pname AS product_name,
            p.price,
            p.sellerid,
            m.mname AS seller_name
        FROM order_product op
        JOIN product p ON op.productid = p.productid
        JOIN market m ON p.sellerid = m.userid
        WHERE op.orderid = %s
    """
    result = execute_query(query, (order_id,))
    return jsonify(result)

# 賣家訂單資料
@app.route('/get_order_seller', methods=['GET'])
def get_order_seller():
    seller_id = request.args.get('sellerid')
    if not seller_id:
        return jsonify({"status": "error", "message": "Missing userid"}), 400

    # 查詢訂單資料
    query = """
        SELECT 
            o.orderid,
            o.otime,
            o.amount,
            o.method,
            o.state,
            o.review,
            d.start_station_add,
            d.end_station_add,
            u.name AS buyer_name
        FROM orders o
        JOIN delivery d ON o.orderid = d.orderid
        JOIN users u ON o.buyerid = u.userid
        WHERE o.sellerid = %s
    """
    result = execute_query(query, (seller_id,))
    if result["status"] == "error":
        return jsonify(result), 500

    orders = result.get("data", [])

    # 查詢每個訂單的商品資料
    for order in orders:
        order_id = order['orderid']
        query_products = """
            SELECT 
                op.productid,
                op.quantity,
                p.pname AS product_name,
                p.price,
                p.sellerid,
                m.mname AS seller_name
            FROM order_product op
            JOIN product p ON op.productid = p.productid
            JOIN market m ON p.sellerid = m.userid
            WHERE op.orderid = %s
        """
        product_result = execute_query(query_products, (order_id,))
        if product_result["status"] == "error":
            return jsonify(product_result), 500

        order['products'] = product_result.get("data", [])  # Add products to each order

    return jsonify({"status": "success", "data": orders})

# 搜尋訂單資料
@app.route('/get_order_info', methods=['GET'])
def get_order_info():
    status = request.args.get('status')  # 取得欄位名稱
    search_value = request.args.get('value')  # 取得搜尋值

    # 構建安全的 SQL 查詢
    query = f"""
        SELECT *
        FROM orders
        WHERE {search_value} = %s
    """
    
    # 執行查詢
    result = execute_query(query, (status,))
    
    # 回傳結果
    return jsonify(result)


# 賣場資料
@app.route('/get_market', methods=['GET'])
def get_market():
    user_id = request.args.get('userid')
    result = execute_query("SELECT * FROM market WHERE userid = %s", (user_id,))
    return jsonify(result)

# 檢舉商品資料
@app.route('/get_reported_products', methods=['GET'])
def get_reported_products():
    query = """
        SELECT 
            p.productid,
            p.pname AS product_name,
            p.price,
            p.sellerid,
            u.name AS seller_name
        FROM product p
        JOIN users u ON p.sellerid = u.userid
        JOIN buyer_behavior bb ON p.productid = bb.productid
        WHERE bb.behavior = 'Report' AND u.state = 'Available'
    """
    result = execute_query(query)
    return jsonify(result)

# 檢舉使用者資料
@app.route('/get_restricted_users', methods=['GET'])
def get_restricted_users():
    query = """
        SELECT 
            u.userid,
            u.name,
            u.email,
            u.phone,
            u.birthday
        FROM users u
        WHERE u.state = 'Restricted'
    """
    result = execute_query(query)
    return jsonify(result)


# --- POST ----------------------

# 註冊
@app.route('/register_user', methods=['POST'])
def register_user():
    data = request.json
    required_fields = ['name', 'email', 'phone', 'password']

    # 檢查必填欄位是否齊全
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"status": "error", "message": "缺少必填欄位"}), 400

    user_id = generate_id()  # 自行生成唯一的 `userid`
    name = data['name']
    email = data['email']
    phone = data['phone']
    password = data['password']
    birthday = data.get('birthday')  # 非必填
    state = 'Available'
    mname = data.get('mname')  # 非必填
    maddress = data.get('maddress') # 非必填

    try:
        query = """
            INSERT INTO users (userid, name, email, phone, password, birthday, state)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        execute_query(query, (user_id, name, email, phone, password, birthday, state), fetch=False)


        query = """
            INSERT INTO market (userid, mname, maddress)
            VALUES (%s, %s, %s)
        """
        execute_query(query, (user_id, mname, maddress), fetch=False)

        return jsonify({"status": "success", "message": "註冊成功"}), 201
    except Exception as e:
        print(f"Error during registration: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# 改賣場名稱
@app.route('/change_market_name', methods=['PUT'])
def change_market_name():
    data = request.json
    required_fields = ['userId', 'marketName']

    # 檢查資料是否齊全
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    user_id = data['userId']
    new_name = data['marketName']

    if not user_id or not new_name:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400

    query = "UPDATE market SET mname = %s WHERE userid = %s"
    result = execute_query(query, (new_name, user_id), fetch=False)
    return jsonify(result)

# 改賣場地址
@app.route('/change_market_address', methods=['PUT'])
def change_market_address():
    data = request.json
    required_fields = ['userId', 'marketAddress']

    # 檢查資料是否齊全
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    user_id = data['userId']
    new_address = data['marketAddress']

    if not user_id or not new_address:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400

    query = "UPDATE market SET maddress = %s WHERE userid = %s"
    result = execute_query(query, (new_address, user_id), fetch=False)
    return jsonify(result)

# 放入購物車
@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    user_id = request.args.get('userid')
    product_id = request.args.get('productid')
    
    if not user_id or not product_id:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400

    query = """
        INSERT INTO cart (userid, productid, quantity)
        VALUES (%s, %s, 1)
        ON CONFLICT (userid, productid)
        DO UPDATE SET quantity = cart.quantity + 1
    """
    result = execute_query(query, (user_id, product_id), fetch=False)
    return jsonify(result)

# 更新購物車商品數量
@app.route('/update_cart_item', methods=['PUT'])
def update_cart_item():
    user_id = request.args.get('userid')
    product_id = request.args.get('productid')
    quantity = request.args.get('quantity')

    if not user_id or not product_id or not quantity:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400

    query = "UPDATE cart SET quantity = %s WHERE userid = %s AND productid = %s"
    result = execute_query(query, (quantity, user_id, product_id), fetch=False)
    return jsonify(result)

# 使用者行為：按讚、不喜歡、回報檢舉
@app.route('/userbehavior', methods=['POST'])
def userbehavior():
    user_id = request.args.get('userid')
    product_id = request.args.get('productid')
    behavior = request.args.get('behavior')

    if not user_id or not product_id or not behavior:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400

    query = """
        INSERT INTO buyer_behavior (userid, productid, behavior, time)
        VALUES (%s, %s, %s, NOW())
        ON CONFLICT (userid, productid)
        DO UPDATE SET behavior = EXCLUDED.behavior, time = NOW()
        WHERE buyer_behavior.behavior != EXCLUDED.behavior;
    """
    
    try:
        result = execute_query(query, (user_id, product_id, behavior), fetch=False)
        return jsonify({"status": "success", "message": "Behavior logged successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 新增訂單函數
@app.route('/add_order', methods=['POST'])
def add_order():
    user_id = request.json.get('userId')
    cart_data = request.json.get('orderData')
    method = request.json.get('method')
    delivery_method = request.json.get('deliveryMethod', 'Standard-Shipping')
    start_station_add = request.json.get('startstationadd', 'Default Start Station')
    address = request.json.get('endstationadd')
    couponid = request.json.get('couponid')

    if not user_id or not cart_data:
        return jsonify({"status": "error", "message": "缺少必要的參數"}), 400
    if not start_station_add or not address:
        return jsonify({"status": "error", "message": "缺少必要的配送信息"}), 400

    with global_lock:  # 全局上鎖，確保整個操作的原子性
        # 驗證商品庫存與優惠券數量
        for seller in cart_data:
            for product in seller.get('products', []):
                product_id = product.get('productId')
                quantity = product.get('quantity')

                if not product_id or quantity <= 0:
                    return jsonify({"status": "error", "message": "商品數據無效"}), 400

                query_check_storage = "SELECT storage FROM product WHERE productid = %s"
                storage_result = execute_query(query_check_storage, (product_id,))
                if storage_result["status"] == "error" or not storage_result["data"]:
                    return jsonify({"status": "error", "message": f"商品 {product_id} 不存在或查詢失敗"}), 400

                available_storage = storage_result["data"][0]["storage"]
                if available_storage < quantity:
                    return jsonify({"status": "error", "message": f"商品 {product_id} 庫存不足"}), 400

        if couponid:
            query_check_coupon = """
                SELECT quantity FROM market_coupon 
                WHERE userid = %s AND couponid = %s
            """
            coupon_result = execute_query(query_check_coupon, (user_id, couponid))
            if coupon_result["status"] == "error" or not coupon_result["data"]:
                return jsonify({"status": "error", "message": "優惠券不存在或查詢失敗"}), 400

            available_coupon = coupon_result["data"][0]["quantity"]
            if available_coupon <= 0:
                return jsonify({"status": "error", "message": "優惠券數量不足"}), 400

        # 開始處理訂單
        for seller in cart_data:
            seller_id = seller.get('sellerId')
            amount = seller.get('amount')
            if not seller_id or not seller.get('products'):
                return jsonify({"status": "error", "message": "無效的賣家或商品數據"}), 400

            order_id = generate_id()  # 生成唯一訂單ID
            print(order_id, user_id, seller_id, amount, method, couponid)

            # 插入到 `orders` 表
            if couponid:
                query_order = """
                    INSERT INTO orders (orderid, otime, buyerid, sellerid, amount, method, state, couponid)
                    VALUES (%s, NOW(), %s, %s, %s, %s, 'Waiting', %s)
                """
                execute_query(query_order, (order_id, user_id, seller_id, amount, method, couponid), fetch=False)
            else:
                query_order = """
                    INSERT INTO orders (orderid, otime, buyerid, sellerid, amount, method, state)
                    VALUES (%s, NOW(), %s, %s, %s, %s, 'Waiting')
                """
                execute_query(query_order, (order_id, user_id, seller_id, amount, method), fetch=False)

            # 處理每個商品
            for product in seller.get('products', []):
                product_id = product.get('productId')
                quantity = product.get('quantity')

                # 更新庫存
                query_update_product = """
                    UPDATE product SET storage = storage - %s WHERE productid = %s
                """
                execute_query(query_update_product, (quantity, product_id), fetch=False)

                # 插入到 `order_product` 表
                query_order_product = """
                    INSERT INTO order_product (orderid, productid, quantity)
                    VALUES (%s, %s, %s)
                """
                execute_query(query_order_product, (order_id, product_id, quantity), fetch=False)

                # 清空購物車
                query_clear_cart = "DELETE FROM cart WHERE userid = %s and productid = %s"
                execute_query(query_clear_cart, (user_id, product_id), fetch=False)

            # 插入到 `delivery` 表
            delivery_fee = calculate_delivery_fee(delivery_method)
            delivery_start_date = time.strftime('%Y-%m-%d')
            delivery_end_date = time.strftime('%Y-%m-%d')  # 根據實際邏輯設計交貨日期

            query_delivery = """
                INSERT INTO delivery (orderid, dmethod, fee, start_date, end_date, start_station_add, end_station_add, state)
                VALUES (%s, %s, %s, %s, %s, %s, %s, 'Shipping')
            """
            execute_query(query_delivery, (
                order_id, delivery_method, delivery_fee, delivery_start_date, delivery_end_date, start_station_add, address
            ), fetch=False)

        # 更新優惠券數量
        if couponid:
            query_coupon = "UPDATE market_coupon SET quantity = quantity - 1 WHERE userid = %s AND couponid = %s"
            execute_query(query_coupon, (user_id, couponid), fetch=False)

    # 返回成功響應
    return jsonify({"status": "success", "message": "訂單成功添加"}), 200

def generate_id():
    id = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(10))
    return id

def calculate_delivery_fee(dmethod):
    # 根据配送方式计算费用
    if dmethod == 'Express-Shipping':
        return 20  # 快递配送费用
    return 5  # 默认标准配送费用

# 新增評論
@app.route('/add_comment', methods=['PUT'])
def add_comment():
    order_id = request.args.get('orderId')
    comment = request.args.get('comment')

    if not order_id or not comment:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400

    query = """
        UPDATE orders SET review = %s WHERE orderId = %s
    """
    execute_query(query, (comment, order_id), fetch=False)
    return jsonify({"status": "success", "message": "Comment added successfully"})


# 退款申請
@app.route('/refund_request', methods=['PUT'])
def refund_request():
    order_id = request.args.get('orderId')
    behavior = request.args.get('behavior')

    if not order_id or not behavior:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400

    query = """
        UPDATE orders SET state = %s WHERE orderId = %s
    """
    execute_query(query, (behavior, order_id), fetch=False)
    return jsonify({"status": "success", "message": "Refund requested successfully"})

# 賣家變更訂單狀態
@app.route('/change_order_state', methods=['PUT'])
def change_order_state():
    order_id = request.args.get('orderId')
    behavior = request.args.get('behavior')

    if not order_id or not behavior:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400

    query = """
        UPDATE orders SET state = %s WHERE orderId = %s
    """
    execute_query(query, (behavior, order_id), fetch=False)
    return jsonify({"status": "success", "message": "Refund requested successfully"})


# 上架商品
@app.route('/upload_product', methods=['POST'])
def upload_product():
    data = request.json
    required_fields = ['userId', 'productName', 'price', 'storage', 'refundPeriod', 'size', 'color']

    # 檢查資料是否齊全
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    user_id = data['userId']
    product_name = data['productName']
    price = data['price']
    storage = data['storage']
    period = data['refundPeriod']
    size = data['size']
    color = data['color']
    state = 'Available'  # 默認設為 'Available'

    product_id = generate_id()

    try:
        # 使用 SQL 序列來生成 product_id
        query = """
            INSERT INTO product (productid, pname, price, sellerid, storage, period, state, size, color)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        result = execute_query(query, (product_id, product_name, price, user_id, storage, period, state, size, color), fetch=False)

        if result["status"] == "success":
            return jsonify({"status": "success"}), 200
        else:
            raise Exception("Failed to insert product")
    except Exception as e:
        print(f"Error uploading product: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# 新增優惠券
@app.route('/add_coupon', methods=['POST'])
def add_coupon():
    data = request.json
    required_fields = ['content', 'condition', 'userid', 'endDate', 'quantity']

    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    content = data['content']
    condition = data['condition']
    userid = data['userid']
    end_date = data['endDate']
    coupon_id = generate_id()
    quantity = data['quantity']

    try:
        query = """
            INSERT INTO coupon (couponid, content, condition, start_date, end_date)
            VALUES (%s, %s, %s, NOW(), %s)
        """
        coupon_result = execute_query(query, (coupon_id, content, condition, end_date), fetch=False)
        if coupon_result["status"] != "success":
            raise Exception("Failed to insert coupon")

        market_coupon_query = """
            INSERT INTO market_coupon (userid, couponid, quantity)
            VALUES (%s, %s, %s)
        """
        execute_query(market_coupon_query, (userid, coupon_id, quantity), fetch=False)
        return jsonify({"status": "success", "couponId": coupon_id}), 200
    except Exception as e:
        print(f"Error adding coupon: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# 封鎖使用者
@app.route('/block_user', methods=['PUT'])
def block_user():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({"status": "error", "message": "Missing userid"}), 400

    query = "UPDATE users SET state = 'Restricted' WHERE userid = %s"
    result = execute_query(query, (user_id,), fetch=False)
    return jsonify(result)

# 解封使用者
@app.route('/unblock_user', methods=['PUT'])
def unblock_user():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({"status": "error", "message": "Missing userid"}), 400

    query = "UPDATE users SET state = 'Available' WHERE userid = %s"
    result = execute_query(query, (user_id,), fetch=False)
    return jsonify(result)

# --- DELETE ----------------------

# 刪除商品
@app.route('/delete_product', methods=['DELETE'])
def delete_product():
    product_id = request.args.get('productid')
    if not product_id:
        return jsonify({"status": "error", "message": "Missing productid"}), 400

    query = "DELETE FROM product WHERE productid = %s"
    result = execute_query(query, (product_id,), fetch=False)
    return jsonify(result)

# 刪除購物車商品
@app.route('/delete_cart_item', methods=['DELETE'])
def delete_cart_item():
    user_id = request.args.get('userid')
    product_id = request.args.get('productid')

    if not user_id or not product_id:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400

    query = "DELETE FROM cart WHERE userid = %s AND productid = %s"
    result = execute_query(query, (user_id, product_id), fetch=False)
    return jsonify(result)

# 刪除購物車資料
@app.route('/clear_cart', methods=['DELETE'])
def clear_cart():
    user_id = request.args.get('userid')
    product_id = request.args.get('productid')
    if not user_id:
        return jsonify({"status": "error", "message": "Missing userid"}), 400

    query = "DELETE FROM cart WHERE userid = %s and productid = %s"
    result = execute_query(query, (user_id, product_id), fetch=False)
    return jsonify(result)

# 刪除優惠券
@app.route('/delete_coupon', methods=['DELETE'])
def delete_coupon():
    coupon_id = request.args.get('couponid')
    if not coupon_id:
        return jsonify({"status": "error", "message": "Missing couponid"}), 400

    query = "DELETE FROM market_coupon WHERE couponid = %s"
    result = execute_query(query, (coupon_id,), fetch=False)

    query = "DELETE FROM coupon WHERE couponid = %s"
    result = execute_query(query, (coupon_id,), fetch=False)
    return jsonify(result)

# 取消檢舉商品
@app.route('/unreport_product', methods=['DELETE'])
def unreport_product():
    product_id = request.args.get('productId')

    if not product_id:
        return jsonify({"status": "error", "message": "Missing productid"}), 400

    query = "DELETE FROM buyer_behavior WHERE productid = %s AND behavior = 'Report'"
    result = execute_query(query, (product_id,), fetch=False)
    return jsonify(result)


# -----------------------------

if __name__ == '__main__':
    app.run(port=5000, debug=True)
