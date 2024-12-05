from flask import Flask, jsonify
import pandas as pd
import duckdb
import psycopg2

app = Flask(__name__)

with open('db_password.txt', 'r') as file:
    db_password = file.read().strip()

psql_conn = psycopg2.connect("dbname='' user='' host='' password=" + db_password)

con = duckdb.connect()

table_names = []

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

# 範例端點，用於獲取數據
@app.route('/get_data', methods=['GET'])
def get_data():
    data = query('''YOUR SQL QUERY HERE''')
    return jsonify(data.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)
