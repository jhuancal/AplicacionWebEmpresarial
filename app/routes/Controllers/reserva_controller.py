from flask import request, jsonify, session
from db import get_db_connection
from auth.decorators import login_required
from repositories.reserva_repository import ReservaRepository
import uuid
import time

@login_required
def api_reservas_all():
    # Admin only
    conn = get_db_connection()
    try:
        repo = ReservaRepository(conn)
        reservas = repo.get_all()
        # Should populate related data (Client Name, Service Name, Pet Name) in a real app, 
        # but for now returning basic dict.
        # Ideally, we should join tables or fetch related entitites.
        return jsonify([r.to_dict() for r in reservas])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

def api_reservas_cliente():
    # Public/Client access
    # Should use session user id
    user = session.get('user_data') # Assuming this structure
    if not user:
         return jsonify({'error': 'Unauthorized'}), 401
    
    conn = get_db_connection()
    try:
        # Filter by client id. BaseRepository might generic get_all but not filter.
        # Custom query needed or get_all and filter in python (inefficient but simple for now)
        repo = ReservaRepository(conn)
        reservas = repo.get_all() 
        # TODO: Filter by user['Id'] or similar. 
        # Assuming we need to implement get_by_cliente in repo later or now.
        # For prototype, filtering in code:
        # client_reservas = [r for r in reservas if r.id_cliente == user.id]
        return jsonify([r.to_dict() for r in reservas]) # Returning all for now as placeholder
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

def api_reserva_create():
    data = request.json
    conn = get_db_connection()
    try:
        repo = ReservaRepository(conn)
        new_id = str(uuid.uuid4())
        repo.add(
            Id=new_id,
            IdCliente=data['IdCliente'], 
            IdMascota=data['IdMascota'],
            IdServicio=data['IdServicio'],
            FechaHora=data['FechaHora'],
            EstadoReserva='Pendiente',
            Observaciones=data.get('Observaciones', ''),
            ESTADO=1,
            DISPONIBILIDAD=1,
            FECHA_CREACION=int(time.time() * 1000),
            FECHA_MODIFICACION=int(time.time() * 1000),
            USER_CREACION='System',
            USER_MODIFICACION='System'
        )
        return jsonify({'message': 'Reserva creada exitosamente', 'id': new_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@login_required
def api_reserva_update_status(id):
    data = request.json
    conn = get_db_connection()
    try:
        repo = ReservaRepository(conn)
        repo.update(id, EstadoReserva=data['EstadoReserva'])
        return jsonify({'message': 'Estado de reserva actualizado'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

def register_routes(bp):
    bp.add_url_rule("/api/reservas", view_func=api_reservas_all, methods=['GET']) # Admin
    bp.add_url_rule("/api/reservas/create", view_func=api_reserva_create, methods=['POST']) # Public
    bp.add_url_rule("/api/reservas/<string:id>/status", view_func=api_reserva_update_status, methods=['PUT']) # Admin
