import mysql.connector
import os

def get_db_connection():
    connection = mysql.connector.connect(
        host=os.getenv('MYSQL_HOST', os.getenv('MYSQLHOST', 'db')),
        user=os.getenv('MYSQL_USER', os.getenv('MYSQLUSER', 'user')),
        password=os.getenv('MYSQL_PASSWORD', os.getenv('MYSQLPASSWORD', 'userpass')),
        database=os.getenv('MYSQL_DATABASE', os.getenv('MYSQLDATABASE', 'tienda')),
        port=int(os.getenv('MYSQL_PORT', os.getenv('MYSQLPORT', 3306)))
    )
    return connection
