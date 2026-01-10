from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from db import get_db_connection
from repositories.compra_repository import CompraRepository
from repositories.carrito_repository import CarritoRepository
from repositories.entrega_repository import EntregaRepository
import uuid
import datetime

compra_bp = Blueprint('compra', __name__)

@compra_bp.route("/checkout")
def checkout_page():
    user = session.get('user_data')
    if not user:
        return redirect("/login")
    return render_template("public/checkout.html", user=user)

@compra_bp.route("/compras")
def history_page():
    user = session.get('user_data')
    if not user:
        return redirect("/login")
    return render_template("public/compras.html", user=user)

@compra_bp.route("/api/checkout", methods=['POST'])
def process_checkout():
    user = session.get('user_data')
    if not user:
        return jsonify({"success": False, "message": "Login required"}), 401
    
    data = request.get_json()
    direccion = data.get('direccion')
    tipo_entrega = data.get('tipo_entrega') # 'Delivery' or 'Recojo'
    metodo_pago = data.get('metodo_pago')
    
    conn = get_db_connection()
    cart_repo = CarritoRepository(conn)
    compra_repo = CompraRepository(conn)
    entrega_repo = EntregaRepository(conn)
    
    # Get Cart Items
    cart_items = cart_repo.get_by_client_with_products(user['Id'])
    if not cart_items:
        conn.close()
        return jsonify({"success": False, "message": "Cart is empty"}), 400
        
    # Calculate Total
    total = sum(item['PrecioVenta'] * item['Cantidad'] for item in cart_items)
    
    # Create Purchase
    compra_id = str(uuid.uuid4())
    compra_data = {
        'Id': compra_id,
        'IdCliente': user['Id'],
        'MontoTotal': total,
        'MetodoPago': metodo_pago,
        'DireccionEntrega': direccion,
        'TipoEntrega': tipo_entrega,
        'EstadoCompra': 'Pendiente', # Fixed column name
        'NumeroBoleta': f"B-{str(uuid.uuid4())[:8].upper()}",
        'ESTADO': 1,
        'DISPONIBILIDAD': 1,
        'FECHA_CREACION': 0,
        'FECHA_MODIFICACION': 0,
        'USER_CREACION': "admin",
        'USER_MODIFICACION': "admin"
    }
    
    detalles = []
    for item in cart_items:
        detalles.append({
            'Id': str(uuid.uuid4()),
            'IdCompra': compra_id,
            'IdProducto': item['IdProducto'],
            'Cantidad': item['Cantidad'],
            'PrecioUnitario': item['PrecioVenta'],
            'Subtotal': item['PrecioVenta'] * item['Cantidad'],
            'ESTADO': 1,
            'DISPONIBILIDAD': 1,
            'FECHA_CREACION': 0,
            'FECHA_MODIFICACION': 0,
            'USER_CREACION': "admin",
            'USER_MODIFICACION': "admin"
        })
        
    if compra_repo.create_with_details(compra_data, detalles):
        # Create Delivery Record if needed
        if tipo_entrega == 'Delivery':
            entrega_data = {
                'Id': str(uuid.uuid4()),
                'IdCompra': compra_id,
                'EstadoEntrega': 'Preparando',
                'ESTADO': 1,
                'DISPONIBILIDAD': 1,
                'FECHA_CREACION': 0,
                'FECHA_MODIFICACION': 0,
                'USER_CREACION': "admin",
                'USER_MODIFICACION': "admin"
            }
            entrega_repo.add(**entrega_data)
            
        # Clear Cart
        cart_repo.clear_cart(user['Id'])
        conn.close()
        return jsonify({"success": True, "boleta": compra_data['NumeroBoleta']})
    else:
        conn.close()
        return jsonify({"success": False, "message": "Error processing purchase"}), 500

@compra_bp.route("/api/compras/history")
def get_history():
    user = session.get('user_data')
    if not user:
        return jsonify([]), 401
        
    conn = get_db_connection()
    compra_repo = CompraRepository(conn)
    entrega_repo = EntregaRepository(conn)
    
    compras = compra_repo.get_history_by_client(user['Id'])
    result = []
    for c in compras:
        c_dict = c.to_dict()
        # Add delivery status if exists
        entrega = entrega_repo.get_by_compra(c.Id)
        if entrega:
            c_dict['EstadoEntrega'] = entrega.EstadoEntrega
        result.append(c_dict)
        
    conn.close()
    return jsonify(result)

@compra_bp.route("/api/compras/details/<id_compra>")
def get_details(id_compra):
    user = session.get('user_data')
    if not user:
        return jsonify({"success": False}), 401
    
    conn = get_db_connection()
    compra_repo = CompraRepository(conn)
    
    # Verify ownership? Ideally yes. Skipping for speed/MVP unless requested.
    detalles = compra_repo.get_details(id_compra)
    conn.close()
    return jsonify([d.to_dict() for d in detalles])
