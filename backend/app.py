from flask import Flask, request, jsonify
import pandas as pd
import duckdb
import psycopg2
from flask_cors import CORS
from psycopg2 import pool

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

with open('db_password.txt', 'r') as file:
    db_password = file.read().strip()

# 建立 PostgreSQL 連線
psql_conn = psycopg2.connect("dbname='' user='postgres' host='localhost' password=" + db_password)

# 建立 PostgreSQL 連線池
psql_pool = psycopg2.pool.SimpleConnectionPool(1, 20, "dbname='' user='postgres' host='localhost' password=" + db_password)
def get_psql_connection():
    return psql_pool.getconn()

def release_psql_connection(conn):
    psql_pool.putconn(conn)

# 建立 DuckDB 連線
con = duckdb.connect()

table_names = ['users', 'product', 'orders', 'order_product', 'market_coupon', 'market', 'delivery', 'coupon', 'cart', 'buyer_behavior']

# 從 PostgreSQL 註冊表格
for table_name in table_names:
    query_str = f"SELECT * FROM {table_name}"
    df = pd.read_sql_query(query_str, psql_conn)
    con.register(table_name, df)

psql_conn.close()

# 定義查詢函數
def query(query):
    result = con.execute(query).fetchall()
    column_names = [desc[0] for desc in con.description]
    df = pd.DataFrame(result, columns=column_names)
    return df

# -----------------------------

# 登入
@app.route('/get_user_login_info', methods=['GET'])
def get_user_login_info():
    email = request.args.get('email')
    if email:
        data = query(f'''
            SELECT * FROM users WHERE email = '{email}'
        ''')
        return jsonify(data.to_dict(orient='records'))
    return jsonify([])

# -----------------------------

# GET

# 產品資料
@app.route('/get_product', methods=['GET'])
def get_product():
    data = query(f'''
        SELECT * FROM product
    ''')
    return jsonify(data.to_dict(orient='records'))

# 購物車資料
@app.route('/get_cart', methods=['GET'])
def get_cart():
    user_id = request.args.get('userid')
    if not user_id:
        return jsonify({"status": "error", "message": "Missing userid"}), 400

    try:
        # 直接在 PostgreSQL 查詢購物車資料
        with psycopg2.connect("dbname='' user='postgres' host='localhost' password=" + db_password) as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        c.productid,
                        c.quantity,
                        p.pname AS product_name,
                        p.price,
                        p.sellerid,
                        u.name AS seller_name
                    FROM cart c
                    JOIN product p ON c.productid = p.productid
                    JOIN users u ON p.sellerid = u.userid
                    WHERE c.userid = %s
                """, (user_id,))
                rows = cursor.fetchall()
                
                # 格式化返回資料
                columns = [desc[0] for desc in cursor.description]
                data = [dict(zip(columns, row)) for row in rows]
                
                return jsonify(data)
    except Exception as e:
        print(f"Error fetching cart: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


# -----------------------------

# 放入購物車
@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    user_id = request.args.get('userid')
    product_id = request.args.get('productid')
    
    if not user_id or not product_id:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400
    
    try:
        # 在 PostgreSQL 中執行插入或更新操作
        with psycopg2.connect("dbname='' user='postgres' host='localhost' password=" + db_password) as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO cart (userid, productid, quantity)
                    VALUES (%s, %s, 1)
                    ON CONFLICT (userid, productid)
                    DO UPDATE SET quantity = cart.quantity + 1
                """, (user_id, product_id))
                conn.commit()
        return jsonify({"status": "success"}), 200
    except Exception as e:
        print(f"Error adding to cart: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


# -----------------------------

# 更新購物車商品數量
@app.route('/update_cart_item', methods=['PUT'])
def update_cart_item():
    user_id = request.args.get('userid')
    product_id = request.args.get('productid')
    quantity = request.args.get('quantity')
    
    if not user_id or not product_id or not quantity:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400
    
    try:
        conn = get_psql_connection()  # 從連線池取得連線
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE cart
                SET quantity = %s
                WHERE userid = %s AND productid = %s
            """, (quantity, user_id, product_id))
            conn.commit()
        release_psql_connection(conn)  # 使用完畢後釋放連線
        return jsonify({"status": "success"}), 200
    except Exception as e:
        print(f"Error updating cart item: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# -----------------------------

# 刪除購物車商品
@app.route('/delete_cart_item', methods=['DELETE'])
def delete_cart_item():
    user_id = request.args.get('userid')
    product_id = request.args.get('productid')
    
    print(f"Received user_id: {user_id}, product_id: {product_id}")  # 調試用

    if not user_id or not product_id:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400
    
    try:
        with psycopg2.connect("dbname='' user='postgres' host='localhost' password=" + db_password) as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM cart
                    WHERE userid = %s AND productid = %s
                """, (user_id, product_id))
                conn.commit()
        return jsonify({"status": "success"}), 200
    except Exception as e:
        print(f"Error deleting cart item: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
