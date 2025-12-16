from flask import Flask, render_template, request, redirect, url_for, jsonify, session
import mysql.connector
import os
from functools import wraps

app = Flask(__name__)
app.secret_key = 'super_secret_key' # Change this in production

MOCK_USERS = {
    'admin': 'admin',
    'user': '1234'
}

def get_db_connection():
    connection = mysql.connector.connect(
        host='db',
        user='user',
        password='userpass',
        database='tienda'
    )
    return connection

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('render_page', page_name='login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route("/")
def home():
    return render_template("public/index.html")

@app.route("/<page_name>.html")
def render_page(page_name):
    try:
        return render_template(f"public/{page_name}.html")
    except:
        return "Page not found", 404

@app.route("/api/login", methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username in MOCK_USERS and MOCK_USERS[username] == password:
        session['user'] = username
        return jsonify({"success": True, "message": "Login successful"})
    
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route("/logout")
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))

@app.route("/admin/dashboard")
@login_required
def dashboard():
    return render_template("admin/dashboard.html", user=session['user'])

@app.route("/api/products")
def get_products():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM products')
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(products)

@app.route("/edit_product/<int:id>")
@login_required
def edit_product(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM products WHERE id = %s', (id,))
    product = cursor.fetchone()
    cursor.close()
    conn.close()
    if product:
        return render_template("admin/edit_product.html", product=product)
    return "Product not found", 404

@app.route("/update_product/<int:id>", methods=['POST'])
@login_required
def update_product(id):
    name = request.form['name']
    description = request.form['description']
    price_regular = request.form['price_regular']
    price_sale = request.form['price_sale']
    discount = request.form['discount']
    arrival_day = request.form['arrival_day']
    image_url = request.form['image_url']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE products
        SET name = %s, description = %s, price_regular = %s, price_sale = %s, discount = %s, arrival_day = %s, image_url = %s
        WHERE id = %s
    ''', (name, description, price_regular, price_sale, discount, arrival_day, image_url, id))
    conn.commit()
    cursor.close()
    conn.close()
    return redirect(url_for('home'))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
