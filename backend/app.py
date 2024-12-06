import time
from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import pool
from flask_cors import CORS
import secrets
import string

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

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
def execute_query(query, params=None, fetch=True):
    conn = get_psql_connection()
    if not conn:
        return {"status": "error", "message": "Database connection failed"}

    try:
        with conn.cursor() as cursor:
            cursor.execute(query, params)
            if fetch:
                rows = cursor.fetchall()
                columns = [desc[0] for desc in cursor.description]
                return {"status": "success", "data": [dict(zip(columns, row)) for row in rows]}
            else:
                conn.commit()
                return {"status": "success"}
    except Exception as e:
        print(f"Error executing query: {e}")
        return {"status": "error", "message": str(e)}
    finally:
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

# 產品資料
@app.route('/get_product', methods=['GET'])
def get_product():
    result = execute_query("""
                        SELECT 
                            p.*, 
                            m.mname AS market_name     
                        FROM product p
                        JOIN market m ON p.sellerid = m.userid
                       """)
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
            m.mname AS seller_name
        FROM cart c
        JOIN product p ON c.productid = p.productid
        JOIN users u ON p.sellerid = u.userid
        JOIN market m ON p.sellerid = m.userid
        WHERE c.userid = %s
    """
    result = execute_query(query, (user_id,))
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


# --- POST ----------------------

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

# 新增訂單
@app.route('/add_order', methods=['POST'])
def add_order():
    user_id = request.json.get('userId')
    cart_data = request.json.get('orderData')

    if not user_id or not cart_data:
        return jsonify({"status": "error", "message": "缺少必要的参数"}), 400
    
    total_order_price = 0  # 用于累加整个订单的总价格
    for seller in cart_data:
        seller_id = seller.get('sellerId')
        seller_total = 0

        # 为每个卖家生成一个唯一的订单 ID
        order_id = generate_order_id()

        # 第 1 步：为每个卖家插入数据到 `orders` 表
        query_order = """
            INSERT INTO orders (orderid, otime, buyerid, sellerid, amount, method, state)
            VALUES (%s, NOW(), %s, %s, %s, %s, 'Pending')
        """
        execute_query(query_order, (order_id, user_id, seller_id, 0, 'Credit-Card'), fetch=False)  # 先插入订单，金额设为0
        
        # 然后将所有商品数据插入 `order_product` 表
        for product in seller.get('products', []):
            product_id = product.get('productId')
            quantity = product.get('quantity')
            price = product.get('price')  # 获取产品价格

            seller_total += price * quantity
            total_order_price += price * quantity

            # 第 2 步：插入数据到 `order_product` 表
            query_order_product = """
                INSERT INTO order_product (orderid, productid, quantity)
                VALUES (%s, %s, %s)
            """
            execute_query(query_order_product, (order_id, product_id, quantity), fetch=False)

        # 第 3 步：更新订单金额
        query_update_order = """
            UPDATE orders
            SET amount = %s
            WHERE orderid = %s AND sellerid = %s
        """
        execute_query(query_update_order, (seller_total, order_id, seller_id), fetch=False)

        # 现在我们确认订单已经插入了 orders 表，再插入 delivery 表
        delivery_method = request.json.get('deliveryMethod', 'Standard-Shipping')
        start_station_add = request.json.get('startstationadd', 'Default Start Station')  # 确保有有效值
        address = request.json.get('endstationadd')
        
        if not start_station_add or not address:
            return jsonify({"status": "error", "message": "缺少必要的配送信息"}), 400
        
        delivery_fee = calculate_delivery_fee(delivery_method)  # 假设这里计算运费
        delivery_start_date = time.strftime('%Y-%m-%d')
        delivery_end_date = time.strftime('%Y-%m-%d')  # 可根据运输方式进行修改

        query_delivery = """
            INSERT INTO delivery (orderid, dmethod, fee, start_date, end_date, start_station_add, end_station_add, state)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'Shipping')
        """
        execute_query(query_delivery, (order_id, delivery_method, delivery_fee, delivery_start_date, delivery_end_date, start_station_add, address), fetch=False)

    # 返回成功的响应
    return jsonify({"status": "success", "message": "订单成功添加"}), 200

def generate_order_id():
    # 确保订单 ID 唯一
    order_id = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(10))
    
    # 可选：检查数据库中是否已存在该 ID（或者让数据库自动处理自增）
    return order_id

def calculate_delivery_fee(dmethod):
    # 根据配送方式计算费用
    if dmethod == 'Express-Shipping':
        return 20  # 快递配送费用
    return 5  # 默认标准配送费用

# 上架商品
@app.route('/upload_product', methods=['GET', 'POST'])
def upload_product():
    data = request.json
    user_id = data.get('userId')
    product_name = data.get('productName')
    price = data.get('price')
    storage = data.get('storage')
    period = data.get('refundPeriod')
    size = data.get('size')
    color = data.get('color')

    i = query('''
        SELECT productid FROM product
        ORDER BY productid DESC
        LIMIT 1;
    ''')
    i = int(i) + 1
    product_id = str(i).zfill(6)

    if not all([user_id, product_name, price, storage, period, size, color]):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    try:
        # 在 PostgreSQL 中執行插入操作
        with psycopg2.connect("dbname='' user='postgres' host='localhost' password=" + db_password) as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO product (productid, pname, price, sellerid, storage, period, size, color)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (product_id, product_name, price, user_id, storage, period, size, color))
                conn.commit()
        return jsonify({"status": "success"}), 200
    except Exception as e:
        print(f"Error uploading product: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# --- DELETE ----------------------

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

# -----------------------------

if __name__ == '__main__':
    app.run(debug=True)
