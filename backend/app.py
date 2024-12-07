import time
from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import pool
from flask_cors import CORS

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

    query = """
        SELECT 
            o.orderid,
            o.otime,
            o.amount,
            o.method,
            o.state,
            o.address,
            op.productid,
            op.quantity,
            p.pname AS product_name,
            p.price,
            p.sellerid,
            m.mname AS seller_name
        FROM orders o
        JOIN order_product op ON o.orderid = op.orderid
        JOIN product p ON op.productid = p.productid
        JOIN market m ON p.sellerid = m.userid
        WHERE o.buyerid = %s
    """
    result = execute_query(query, (user_id,))
    return jsonify({"data": result})


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

@app.route('/add_order', methods=['POST'])
def add_order():
    user_id = request.json.get('userId')
    cart_data = request.json.get('orderData')

    if not user_id or not cart_data:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400
    
    # Generate order ID (can be replaced with a more robust ID generation method)
    order_id = generate_order_id()

    # Step 1: Insert into the `orders` table for each seller
    total_order_price = 0  # This will accumulate the total price for the entire order
    for seller in cart_data:
        seller_id = seller.get('sellerId')
        seller_total = 0
        for product in seller.get('products', []):
            product_id = product.get('productId')
            quantity = product.get('quantity')
            price = get_product_price(product_id)  # Assume this function fetches the price of the product

            # Add to the total price for the seller
            seller_total += price * quantity
            total_order_price += price * quantity

            # Step 2: Insert into `order_product` table
            query_order_product = """
                INSERT INTO order_product (orderid, productid, quantity)
                VALUES (%s, %s, %s)
            """
            execute_query(query_order_product, (order_id, product_id, quantity), fetch=False)

        # Step 3: Insert into `orders` table (for the current seller)
        query_order = """
            INSERT INTO orders (orderid, otime, buyerid, sellerid, amount, method, state)
            VALUES (%s, NOW(), %s, %s, %s, %s, 'Pending')
        """
        execute_query(query_order, (order_id, user_id, seller_id, seller_total, 'Credit-Card'), fetch=False)

    # Step 4: Insert into `delivery` table for the entire order
    delivery_method = request.json.get('deliveryMethod', 'Standard-Shipping')
    address = request.json.get('address')
    delivery_fee = calculate_delivery_fee(delivery_method)  # Assume this calculates delivery fee
    delivery_start_date = time.strftime('%Y-%m-%d')
    delivery_end_date = time.strftime('%Y-%m-%d')  # Example, could be based on method

    query_delivery = """
        INSERT INTO delivery (orderid, dmethod, fee, start_date, end_date, start_station_add, end_station_add, state)
        VALUES (%s, %s, %s, %s, %s, %s, %s, 'Shipping')
    """
    execute_query(query_delivery, (order_id, delivery_method, delivery_fee, delivery_start_date, delivery_end_date, address, address), fetch=False)

    # Return success response
    return jsonify({"status": "success", "message": "Order added successfully"}), 200

def generate_order_id():
    # Example logic to generate a unique order ID based on timestamp
    return "ORDER" + str(int(time.time()))

def get_product_price(product_id):
    # Query to fetch the product price based on product ID
    query = "SELECT price FROM product WHERE productid = %s"
    result = execute_query(query, (product_id,))
    if result:
        return result[0]['price']
    return 0  # Default price if not found

def calculate_delivery_fee(dmethod):
    # Simple fee calculation logic based on delivery method
    if dmethod == 'Express-Shipping':
        return 20  # Example for Express Shipping
    return 5  # Default Standard Shipping fee


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

# -----------------------------

if __name__ == '__main__':
    app.run(debug=True)
