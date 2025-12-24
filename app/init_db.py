import os
import mysql.connector
import time

def wait_for_db():
    retries = 30
    while retries > 0:
        try:
            conn = mysql.connector.connect(
                host=os.getenv('MYSQL_HOST', 'db'),
                user=os.getenv('MYSQL_USER', 'user'),
                password=os.getenv('MYSQL_PASSWORD', 'userpass'),
                port=int(os.getenv('MYSQL_PORT', 3306))
            )
            print("Database connection successful")
            return conn
        except mysql.connector.Error as err:
            print(f"Waiting for database... ({err})")
            time.sleep(2)
            retries -= 1
    return None

def init_db():
    # Only run initialization if we can connect to the server
    conn = wait_for_db()
    if not conn:
        print("Could not connect to database for initialization.")
        return

    # Check if database exists/needs init
    # NOTE: Railway often gives you a pre-created DB. 
    # But init.sql has "CREATE TABLE IF NOT EXISTS", so it is safe to run.
    
    db_name = os.getenv('MYSQL_DATABASE', 'tienda')
    cursor = conn.cursor()
    
    # Create DB if not exists (might not be allowed in some providers but good for local)
    try:
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
        print(f"Database {db_name} ensured.")
    except Exception as e:
        print(f"Skipping DB creation (might already exist or permission denied): {e}")

    conn.database = db_name
    
    # helper to run script
    def run_script(filename):
        print(f"Running script {filename}...")
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
                # Split by semicolon to run statements
                statements = content.split(';')
                for statement in statements:
                    stmt = statement.strip()
                    if stmt:
                        try:
                            cursor.execute(stmt)
                        except mysql.connector.Error as err:
                            print(f"Error running statement: {err}")
            conn.commit()
            print(f"Script {filename} executed.")
        except FileNotFoundError:
            print(f"File {filename} not found.")

    # Run init.sql if tables likely empty
    # Check if a core table exists
    try:
        cursor.execute("SHOW TABLES LIKE 'Seg_Usuario'")
        result = cursor.fetchone()
        if not result:
            print("Target table not found. Running initialization...")
            run_script('/app/db/init.sql')
        else:
            print("Tables already exist. Skipping initialization.")
    except Exception as e:
        print(f"Error checking tables: {e}")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    init_db()
