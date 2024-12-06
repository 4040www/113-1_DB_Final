from flask import Flask, request, jsonify
import pandas as pd
import duckdb
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")


with open('db_password.txt', 'r') as file:
    db_password = file.read().strip()

psql_conn = psycopg2.connect("dbname='' user='postgres' host='localhost' password=" + db_password)

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

# 登入
@app.route('/get_user_login_info', methods=['GET'])
def get_data():
    email = request.args.get('email')
    if email:
        data = query(f'''
            SELECT password FROM users WHERE email = '{email}'
        ''')
        return jsonify(data.to_dict(orient='records'))
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)
