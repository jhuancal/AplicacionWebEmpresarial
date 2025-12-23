import mysql.connector
import os

def get_db_connection():
    connection = mysql.connector.connect(
        host=os.getenv('MYSQL_HOST', 'db'),
        user=os.getenv('MYSQL_USER', 'user'),
        password=os.getenv('MYSQL_PASSWORD', 'userpass'),
        database=os.getenv('MYSQL_DATABASE', 'tienda'),
        port=int(os.getenv('MYSQL_PORT', 3306))
    )
    return connection
