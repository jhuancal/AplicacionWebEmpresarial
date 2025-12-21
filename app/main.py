from flask import Flask, render_template, request, redirect, url_for, jsonify, session
import mysql.connector
import os
from functools import wraps
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'super_secret_key' # Change this in production
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'static', 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True) # Ensure dir exists

MOCK_USERS = {
    'admin': 'admin',
    'user': '1234'
}

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

from db import get_db_connection
from repositories.producto import ProductoRepository
from repositories.usuario import UsuarioRepository
from entities.usuario import Usuario
from entities.producto import Producto

@app.route("/api/products")
def get_products():
    conn = get_db_connection()
    repo = ProductoRepository(conn)
    products = repo.get_all()
    conn.close()
    # Helper to convert Entity objects to dicts for JSON
    return jsonify([p.to_dict() for p in products])

@app.route("/edit_product/<string:id>")
@login_required
def edit_product(id):
    conn = get_db_connection()
    repo = ProductoRepository(conn)
    product = repo.get_by_id(id)
    conn.close()
    if product:
        return render_template("admin/edit_product.html", product=product)
    return "Product not found", 404

@app.route("/update_product/<string:id>", methods=['POST'])
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
    repo = ProductoRepository(conn)
    repo.update(id, 
                Nombre=name, 
                Descripcion=description, 
                PrecioRegular=price_regular, 
                PrecioVenta=price_sale, 
                Descuento=discount, 
                DiaLlegada=arrival_day, 
                UrlImagen=image_url)
    conn.close()
    return redirect(url_for('dashboard'))

from repositories.usuario import UsuarioRepository
import uuid
import time
from entities.usuario import Usuario
from entities.producto import Producto

# Entity-Repository Mapping
def get_repo_and_entity(entity_name, conn):
    if entity_name == 'adm_administracion_producto':
        return ProductoRepository(conn), Producto
    elif entity_name == 'seg_seguridad_usuario':
        return UsuarioRepository(conn), Usuario
    return None, None

@app.route("/api/<entity_name>/GetAll", methods=['POST'])
def api_get_all(entity_name):
    conn = get_db_connection()
    repo, _ = get_repo_and_entity(entity_name, conn)
    if not repo:
        conn.close()
        return jsonify({"error": "Entity not found"}), 404
    data = repo.get_all()
    conn.close()
    return jsonify([d.to_dict() for d in data])

@app.route("/api/<entity_name>/CountAll", methods=['POST'])
def api_count_all(entity_name):
    data = request.get_json()
    filters = data if isinstance(data, list) else None # Filters passed directly as list
    
    conn = get_db_connection()
    repo, _ = get_repo_and_entity(entity_name, conn)
    if not repo:
        conn.close()
        return jsonify({"error": "Entity not found"}), 404
    count = repo.count_all(filters)
    conn.close()
    return jsonify([count]) # Helper expects array

@app.route("/api/<entity_name>/GetPaged", methods=['POST'])
def api_get_paged(entity_name):
    data = request.get_json()
    start_index = data.get('startIndex', 0)
    length = data.get('length', 10)
    filters = data.get('filtros')
    order = data.get('orden')

    conn = get_db_connection()
    repo, _ = get_repo_and_entity(entity_name, conn)
    if not repo:
        conn.close()
        return jsonify({"error": "Entity not found"}), 404
    
    # Ensure correct types
    try:
        start_index = int(start_index)
        length = int(length)
    except:
        start_index = 0
        length = 10

    data = repo.get_paged(start_index, length, filters, order)
    conn.close()
    return jsonify(data)

@app.route("/api/<entity_name>/Insert", methods=['POST'])
def api_insert(entity_name):
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()
        
    conn = get_db_connection()
    repo, entity_class = get_repo_and_entity(entity_name, conn)
    if not repo:
        conn.close()
        return jsonify({"error": "Entity not found"}), 404
    
    # Add System Fields
    data['Id'] = str(uuid.uuid4())
    data['ESTADO'] = 1
    data['DISPONIBILIDAD'] = 1
    data['FECHA_CREACION'] = int(time.time() * 1000)
    data['FECHA_MODIFICACION'] = int(time.time() * 1000)
    data['USER_CREACION'] = session.get('user', 'SYS')
    data['USER_MODIFICACION'] = session.get('user', 'SYS')
    
    # Filter kwargs to match Entity constructor
    # Simple approach: pass data, Entity ignores extra if safe, or we filter explicitly
    # But Repository.add uses keys to build SQL, so we MUST filter to valid columns
    
    # Handle File Upload
    if request.files:
        # data is already populated from request.form above if not json
        
        file = request.files.get('Imagen') # Key from FormData
        if file and file.filename != '':
            filename = secure_filename(f"{data['Id']}_{file.filename}")
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            data['UrlImagen'] = f"/static/uploads/{filename}"
    
    try:
        repo.add(**data)
        conn.close()
        return jsonify({"id": data['Id']})
    except Exception as e:
        conn.close()
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/<entity_name>/Update", methods=['PUT'])
def api_update(entity_name):
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()
        
    id = data.get('Id')
    if not id:
        return jsonify({"error": "Id required"}), 400
        
    conn = get_db_connection()
    repo, _ = get_repo_and_entity(entity_name, conn)
    if not repo:
        conn.close()
        return jsonify({"error": "Entity not found"}), 404
    
    data['FECHA_MODIFICACION'] = int(time.time() * 1000)
    data['USER_MODIFICACION'] = session.get('user', 'SYS')

    # Handle File Upload for Update
    if request.files:
         file = request.files.get('Imagen')
         if file and file.filename != '':
            filename = secure_filename(f"{id}_{file.filename}")
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            data['UrlImagen'] = f"/static/uploads/{filename}"

    # Remove Id from data so we don't try to update it in SET clause (update method handles it)
    data_to_update = {k: v for k, v in data.items() if k != 'Id'}

    try:
        repo.update(id, **data_to_update)
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        conn.close()
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/<entity_name>/Delete", methods=['DELETE'])
def api_delete(entity_name):
    data = request.get_json()
    id = data.get('Id')
    if not id:
        return jsonify({"error": "Id required"}), 400
    
    conn = get_db_connection()
    repo, _ = get_repo_and_entity(entity_name, conn)
    if not repo:
        conn.close()
        return jsonify({"error": "Entity not found"}), 404

    try:
        repo.delete(id)
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        conn.close()
        print(e)
        return jsonify({"error": str(e)}), 500


# Admin Pages Routes
@app.route("/admin/administracion/producto")
@login_required
def admin_producto():
    return render_template("admin/Administracion/producto.html", user=session['user'])

@app.route("/admin/seguridad/usuario")
@login_required
def admin_usuario():
    return render_template("admin/Seguridad/usuario.html", user=session['user'])

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

