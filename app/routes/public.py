from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from auth.auth_service import AuthService
from auth.serializers import serialize_user
from db import get_db_connection
from repositories.producto import ProductoRepository

public_bp = Blueprint('public', __name__)

@public_bp.route("/")
@public_bp.route("/productos")
@public_bp.route("/servicios")
@public_bp.route("/publicaciones")
def home():
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

@public_bp.route("/api/register", methods=['POST'])
def register():
    data = request.get_json()
    result = AuthService.register_client(data)
    if result.get('success'):
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
    return jsonify([p.to_dict() for p in products])
