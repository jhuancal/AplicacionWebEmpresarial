import mysql.connector

def get_db_connection():
    connection = mysql.connector.connect(
        host='db',
        user='user',
        password='userpass',
        database='tienda'
    )
    return connection
