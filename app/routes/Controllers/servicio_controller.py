from flask import request, jsonify
from db import get_db_connection
from auth.decorators import login_required
from repositories.servicio_repository import ServicioRepository
import uuid

def api_servicios_all():
    conn = get_db_connection()
    try:
        repo = ServicioRepository(conn)
        servicios = repo.get_all()
        return jsonify([s.to_dict() for s in servicios])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@login_required
def api_servicio_create():
    data = request.json
    conn = get_db_connection()
    try:
        repo = ServicioRepository(conn)
        new_id = str(uuid.uuid4())
        repo.add(
            Id=new_id,
            Nombre=data['Nombre'],
            TipoMascota=data['TipoMascota'],
            Categoria=data['Categoria'],
            DuracionMinutos=data['DuracionMinutos'],
            Costo=data['Costo'],
            Descripcion=data['Descripcion'],
            Requisitos=data['Requisitos'],
            Horario=data.get('Horario', ''),
            PersonalAsignado=data.get('PersonalAsignado', ''),
            ESTADO=1,
            DISPONIBILIDAD=1,
            FECHA_CREACION=0, # Should be timestamp
            FECHA_MODIFICACION=0,
            USER_CREACION='Admin', # Should be session user
            USER_MODIFICACION='Admin'
        )
        return jsonify({'message': 'Servicio creado exitosamente', 'id': new_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@login_required
def api_servicio_update(id):
    data = request.json
    conn = get_db_connection()
    try:
        repo = ServicioRepository(conn)
        repo.update(id, **data)
        return jsonify({'message': 'Servicio actualizado exitosamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@login_required
def api_servicio_delete(id):
    conn = get_db_connection()
    try:
        repo = ServicioRepository(conn)
        repo.update(id, ESTADO=0)
        return jsonify({'message': 'Servicio eliminado exitosamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

def register_routes(bp):
    bp.add_url_rule("/api/servicios", view_func=api_servicios_all, methods=['GET'])
    bp.add_url_rule("/api/servicios", view_func=api_servicio_create, methods=['POST'])
    bp.add_url_rule("/api/servicios/<string:id>", view_func=api_servicio_update, methods=['PUT'])
    bp.add_url_rule("/api/servicios/<string:id>", view_func=api_servicio_delete, methods=['DELETE'])