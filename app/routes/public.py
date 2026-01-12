from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from auth.auth_service import AuthService
from auth.serializers import serialize_user
from db import get_db_connection
from repositories.producto_repository import ProductoRepository
from repositories.carrito_repository import CarritoRepository
from repositories.entrega_repository import EntregaRepository
from repositories.compra_repository import CompraRepository
from services.email_service import ServicioCorreo
import uuid

publico_bp = Blueprint('public', __name__)

@publico_bp.route("/")
def home():
    user = session.get('user_data')
    return render_template("public/index.html", user=user)

@publico_bp.route("/adopcion")
def adopcion_page():
    user = session.get('user_data')
    return render_template("public/views/adopcion.html", user=user)

@publico_bp.route("/productos")
def productos_page():
    user = session.get('user_data')
    return render_template("public/views/productos.html", user=user)

@publico_bp.route("/servicios")
def servicios_page():
    user = session.get('user_data')
    return render_template("public/views/servicios.html", user=user)

@publico_bp.route("/publicaciones")
def publicaciones_page():
    user = session.get('user_data')
    return render_template("public/views/publicaciones.html", user=user)

@publico_bp.route("/registro")
def register_page():
    user = session.get('user_data')
    return render_template("public/views/registro.html", user=user)



@publico_bp.route("/login")
def login_redirect():
    return redirect("/")

@publico_bp.route("/api/login", methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if AuthService.validate_user(username, password):
        user_details = AuthService.get_user_details(username)
        if user_details:
            user_model = serialize_user(user_details)
            session['user_data'] = user_model
            return jsonify({"success": True, "message": "Login successful", "user": user_model})

    return jsonify({"success": False, "message": "Invalid credentials"}), 401

@publico_bp.route("/api/auth/initiate-register", methods=['POST'])
def initiate_register():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400
        
    result = AuthService.initiate_verification(email)
    if result.get('success'):
        return jsonify(result)
    return jsonify(result), 400

@publico_bp.route("/api/auth/verify-code", methods=['POST'])
def verify_code():
    data = request.get_json()
    result = AuthService.verify_registration(data)
    if result.get('success'):
        return jsonify(result)
    return jsonify(result), 400

@publico_bp.route("/api/register", methods=['POST'])
def register():
    data = request.get_json()
    result = AuthService.register_client(data)
    if result.get('success'):
         
         email = data.get('correo')
         username = data.get('username') or data.get('nombres')
         if email:
             ServicioCorreo.enviar_correo_bienvenida(email, username)
             
         return jsonify(result)
    return jsonify(result), 400

@publico_bp.route("/logout")
def logout():
    session.pop('user_data', None)
    return redirect(url_for('public.home'))

@publico_bp.route("/api/products")
def get_products():
    conn = get_db_connection()
    repo = ProductoRepository(conn)
    products = repo.get_all()
    conn.close()
    conn.close()
    return jsonify([p.to_dict() for p in products])



@publico_bp.route("/api/public/mascotas")
def get_public_mascotas():
    from repositories.mascota_repository import MascotaRepository
    conn = get_db_connection()
    repo = MascotaRepository(conn)
    pets = repo.get_all_with_photos()
    conn.close()
    return jsonify([p.to_dict() for p in pets])

@publico_bp.route("/api/mis-mascotas")
def get_mis_mascotas():
    user = session.get('user_data')
    if not user:
        return jsonify([])
    
    from repositories.mascota_repository import MascotaRepository
    conn = get_db_connection()
    try:
        repo = MascotaRepository(conn)

        my_pets = repo.get_by_cliente(user['Id'])
        return jsonify([p.to_dict() for p in my_pets])
    except:
        return jsonify([])
    finally:
        conn.close()


@publico_bp.route("/api/carrito/add", methods=['POST'])
def add_to_cart():
    user = session.get('user_data')
    if not user:
        return jsonify({"success": False, "message": "Login required"}), 401
    
    data = request.get_json()
    id_producto = data.get('id_producto')
    cantidad = int(data.get('cantidad', 1))
    
    conn = get_db_connection()
    repo = CarritoRepository(conn)
    
    existing_item = repo.get_item(user['Id'], id_producto)
    
    if existing_item:
        new_qty = existing_item.Cantidad + cantidad
        repo.update_quantity(user['Id'], id_producto, new_qty)
    else:
        new_item = {
            'Id': str(uuid.uuid4()),
            'IdCliente': user['Id'],
            'IdProducto': id_producto,
            'Cantidad': cantidad,
            'ESTADO': 1,
            'DISPONIBILIDAD': 1,
            'FECHA_CREACION': 0, # Should be timestamp
            'FECHA_MODIFICACION': 0,
            'USER_CREACION': "abelcliente",
            'USER_MODIFICACION': "abelcliente"
        }
        repo.add(**new_item)
    
    conn.close()
    return jsonify({"success": True})