import os
import time
import uuid
from flask import request, jsonify, session, current_app
from werkzeug.utils import secure_filename
from db import get_db_connection

from repositories.producto_repository import ProductoRepository
from repositories.persona_repository import PersonaRepository
from repositories.cliente_repository import ClienteRepository
from repositories.colaborador_repository import ColaboradorRepository
from repositories.mascota_repository import MascotaRepository
from repositories.rol_repository import RolRepository
from repositories.reserva_repository import ReservaRepository
from repositories.servicio_repository import ServicioRepository
from repositories.compra_repository import CompraRepository
from repositories.carrito_repository import CarritoRepository
from repositories.publicacion_repository import PublicacionRepository
from repositories.adopcion_repository import AdopcionRepository

from entities.producto import Producto
from entities.persona import Persona
from entities.cliente import Cliente
from entities.colaborador import Colaborador
from entities.mascota import Mascota
from entities.rol import Rol
from entities.reserva import Reserva
from entities.servicio import Servicio
from entities.compra import Compra
from entities.carrito import Carrito
from entities.publicacion import Publicacion
from entities.adopcion_solicitud import AdopcionSolicitud

def get_repo_and_entity(entity_name, conn):
    if entity_name == 'adm_administracion_producto':
        return ProductoRepository(conn), Producto
    elif entity_name == 'adm_administracion_persona':
        return PersonaRepository(conn), Persona
    elif entity_name == 'adm_administracion_mascota':
        return MascotaRepository(conn), Mascota
    elif entity_name == 'adm_administracion_servicio':
        return ServicioRepository(conn), Servicio
    elif entity_name == 'adm_clientes_reserva':
        return ReservaRepository(conn), Reserva
    elif entity_name == 'seg_seguridad_cliente':
        return ClienteRepository(conn), Cliente
    elif entity_name == 'seg_seguridad_colaborador':
        return ColaboradorRepository(conn), Colaborador
    elif entity_name == 'seg_seguridad_rol':
        return RolRepository(conn), Rol
    elif entity_name == 'adm_clientes_compra':
        return CompraRepository(conn), Compra
    elif entity_name == 'adm_clientes_carrito':
        return CarritoRepository(conn), Carrito
    elif entity_name == 'adm_clientes_publicacion':
        return PublicacionRepository(conn), Publicacion
    elif entity_name == 'adm_clientes_adopcion_solicitud':
        return AdopcionRepository(conn), AdopcionSolicitud
    return None, None

def api_get_all(entity_name):
    conn = get_db_connection()
    repo, _ = get_repo_and_entity(entity_name, conn)
    if not repo:
        conn.close()
        return jsonify({"error": "Entity not found"}), 404
    data = repo.get_all()
    conn.close()
    return jsonify([d.to_dict() for d in data])

def api_count_all(entity_name):
    data = request.get_json()
    filters = data if isinstance(data, list) else None
    
    conn = get_db_connection()
    repo, _ = get_repo_and_entity(entity_name, conn)
    if not repo:
        conn.close()
        return jsonify({"error": "Entity not found"}), 404
    count = repo.count_all(filters)
    conn.close()
    return jsonify([count])

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
    
    try:
        start_index = int(start_index)
        length = int(length)
    except:
        start_index = 0
        length = 10

    data = repo.get_paged(start_index, length, filters, order)
    conn.close()
    return jsonify(data)

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
    data['Id'] = str(uuid.uuid4())
    data['ESTADO'] = 1
    data['DISPONIBILIDAD'] = 1
    data['FECHA_CREACION'] = int(time.time() * 1000)
    data['FECHA_MODIFICACION'] = int(time.time() * 1000)
    data['USER_CREACION'] = session.get('user_data', {}).get('Username', 'SYS')
    data['USER_MODIFICACION'] = session.get('user_data', {}).get('Username', 'SYS')

    if request.files:
        file = request.files.get('Imagen')
        if file and file.filename != '':
            filename = secure_filename(f"{data['Id']}_{file.filename}")
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            data['UrlImagen'] = f"/static/uploads/{filename}"
    
    try:
        repo.add(**data)
        conn.close()
        return jsonify({"id": data['Id']})
    except Exception as e:
        conn.close()
        print(e)
        return jsonify({"error": str(e)}), 500

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
    data['USER_MODIFICACION'] = session.get('user_data', {}).get('Username', 'SYS')

    if request.files:
         file = request.files.get('Imagen')
         if file and file.filename != '':
            filename = secure_filename(f"{id}_{file.filename}")
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            data['UrlImagen'] = f"/static/uploads/{filename}"

    data_to_update = {k: v for k, v in data.items() if k != 'Id'}

    try:
        repo.update(id, **data_to_update)
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        conn.close()
        print(e)
        return jsonify({"error": str(e)}), 500

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

def register_routes(bp):
    bp.add_url_rule("/api/<entity_name>/GetAll", view_func=api_get_all, methods=['GET'])
    bp.add_url_rule("/api/<entity_name>/CountAll", view_func=api_count_all, methods=['POST'])
    bp.add_url_rule("/api/<entity_name>/GetPaged", view_func=api_get_paged, methods=['POST'])
    bp.add_url_rule("/api/<entity_name>/Insert", view_func=api_insert, methods=['POST'])
    bp.add_url_rule("/api/<entity_name>/Update", view_func=api_update, methods=['PUT'])
    bp.add_url_rule("/api/<entity_name>/Delete", view_func=api_delete, methods=['DELETE'])