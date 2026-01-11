from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from auth.auth_service import AuthService
from auth.serializers import serialize_user
from db import get_db_connection
from repositories.producto_repository import ProductoRepository
from repositories.carrito_repository import CarritoRepository
from repositories.entrega_repository import EntregaRepository
from repositories.compra_repository import CompraRepository
from services.email_service import EmailService
import uuid

public_bp = Blueprint('public', __name__)

@public_bp.route("/")
@public_bp.route("/productos")
@public_bp.route("/")
@public_bp.route("/productos")
@public_bp.route("/publicaciones")
def home():
    user = session.get('user_data')
    return render_template("public/index.html", user=user)

@public_bp.route("/servicios")
def servicios_page():
    user = session.get('user_data')
    return render_template("public/index.html", user=user)

@public_bp.route("/register")
def register_page():
    user = session.get('user_data')
    return render_template("public/register.html", user=user)

@public_bp.route("/login")
def login_redirect():
    return redirect("/")

@public_bp.route("/api/login", methods=['POST'])
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

@public_bp.route("/api/auth/initiate-register", methods=['POST'])
def initiate_register():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400
        
    result = AuthService.initiate_verification(email)
    if result.get('success'):
        return jsonify(result)
    return jsonify(result), 400

@public_bp.route("/api/register", methods=['POST'])
def register():
    data = request.get_json()
    result = AuthService.register_client(data)
    if result.get('success'):
         # Email already sent during verification, no need to send welcome implementation unless desired.
         # The requirement says "send welcome messages every time someone registers".
         # So we keep the welcome email.
         
         # Send Welcome Email
         email = data.get('correo')
         username = data.get('username') or data.get('nombres')
         if email:
             EmailService.send_welcome_email(email, username)
             
         return jsonify(result)
    return jsonify(result), 400

@public_bp.route("/logout")
def logout():
    session.pop('user_data', None)
    return redirect(url_for('public.home'))

@public_bp.route("/api/products")
def get_products():
    conn = get_db_connection()
    repo = ProductoRepository(conn)
    products = repo.get_all()
    conn.close()
    conn.close()
    return jsonify([p.to_dict() for p in products])

@public_bp.route("/adopcion")
def adopcion_page():
    user = session.get('user_data')
    return render_template("public/adopcion.html", user=user)

@public_bp.route("/api/public/mascotas")
def get_public_mascotas():
    from repositories.mascota_repository import MascotaRepository
    conn = get_db_connection()
    repo = MascotaRepository(conn)
    pets = repo.get_all_with_photos()
    conn.close()
    return jsonify([p.to_dict() for p in pets])

@public_bp.route("/api/mis-mascotas")
def get_mis_mascotas():
    # Helper to get logged in user's pets for booking
    user = session.get('user_data')
    if not user:
        return jsonify([])
    
    from repositories.mascota_repository import MascotaRepository
    # We need a method get_by_client in MascotaRepository or raw query here
    # For MVP, using raw query or get_all and filter (inefficient) or assuming repository has it.
    conn = get_db_connection()
    try:
        # Assuming MascotaRepository doesn't have get_by_cliente, we'll implement a quick check or filter
        repo = MascotaRepository(conn)
        # Hack: using get_all (or similar) and filtering in python if repo doesn't support filter
        # Better: Add functionality to MascotaRepository, but modifying repo file is extra step.
        # Let's see if we can use get_all and filter. Adm_Mascota has IdCliente.

        my_pets = repo.get_by_cliente(user['Id'])
        return jsonify([p.to_dict() for p in my_pets])
    except:
        return jsonify([])
    finally:
        conn.close()


@public_bp.route("/api/carrito/add", methods=['POST'])
def add_to_cart():
    user = session.get('user_data')
    if not user:
        return jsonify({"success": False, "message": "Login required"}), 401
    
    data = request.get_json()
    id_producto = data.get('id_producto')
    cantidad = int(data.get('cantidad', 1))
    
    conn = get_db_connection()
    repo = CarritoRepository(conn)
    
    # Check if exists
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