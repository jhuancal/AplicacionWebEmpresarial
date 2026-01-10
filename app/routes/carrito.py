from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from db import get_db_connection
from repositories.carrito_repository import CarritoRepository
import uuid

carrito_bp = Blueprint('carrito', __name__)

@carrito_bp.route("/carrito")
def view_cart():
    user = session.get('user_data')
    if not user:
        return redirect("/login")
    return render_template("public/carrito.html", user=user)

@carrito_bp.route("/api/carrito/items")
def get_cart_items():
    user = session.get('user_data')
    if not user:
        return jsonify([]), 401
    
    conn = get_db_connection()
    repo = CarritoRepository(conn)
    items = repo.get_by_client_with_products(user['Id'])
    conn.close()
    return jsonify(items)

@carrito_bp.route("/api/carrito/add", methods=['POST'])
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
            'USER_CREACION': user['NombreUsuario'],
            'USER_MODIFICACION': user['NombreUsuario']
        }
        repo.add(**new_item)
    
    conn.close()
    return jsonify({"success": True})

@carrito_bp.route("/api/carrito/update", methods=['POST'])
def update_cart_item():
    user = session.get('user_data')
    if not user:
        return jsonify({"success": False}), 401
        
    data = request.get_json()
    id_producto = data.get('id_producto')
    cantidad = int(data.get('cantidad', 1))
    
    conn = get_db_connection()
    repo = CarritoRepository(conn)
    
    if cantidad > 0:
        repo.update_quantity(user['Id'], id_producto, cantidad)
    else:
        repo.remove_item(user['Id'], id_producto)
        
    conn.close()
    return jsonify({"success": True})

@carrito_bp.route("/api/carrito/remove", methods=['POST'])
def remove_from_cart():
    user = session.get('user_data')
    if not user:
        return jsonify({"success": False}), 401
        
    data = request.get_json()
    id_producto = data.get('id_producto')
    
    conn = get_db_connection()
    repo = CarritoRepository(conn)
    repo.remove_item(user['Id'], id_producto)
    conn.close()
    return jsonify({"success": True})
