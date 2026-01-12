import os
import uuid
import time
from flask import request, jsonify, session, current_app
from werkzeug.utils import secure_filename
from db import get_db_connection
from auth.decorators import login_required
from repositories.mascota_repository import MascotaRepository

@login_required
def api_get_all_mascotas():
    conn = get_db_connection()
    try:
        repo = MascotaRepository(conn)
        data = repo.get_all_with_photos()
        return jsonify([d.to_dict() for d in data])
    finally:
        conn.close()

@login_required
def api_insert_mascota():
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()
        
    conn = get_db_connection()
    try:
        repo = MascotaRepository(conn)
        
        mascota_id = str(uuid.uuid4())
        data['Id'] = mascota_id
        data['ESTADO'] = 1
        data['DISPONIBILIDAD'] = 1
        data['FECHA_CREACION'] = int(time.time() * 1000)
        data['FECHA_MODIFICACION'] = int(time.time() * 1000)
        data['USER_CREACION'] = session.get('user_data', {}).get('Username', 'SYS')
        data['USER_MODIFICACION'] = session.get('user_data', {}).get('Username', 'SYS')
        data['IdCliente'] = None # Explicitly None for adoption pets
        
        repo.add(**data)
        
        files = request.files.getlist('fotos')
        for file in files:
            if file and file.filename != '':
                filename = secure_filename(f"{mascota_id}_{file.filename}")
                file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
                url = f"/static/uploads/{filename}"
                repo.add_photo(mascota_id, url)
                
        return jsonify({"success": True, "id": mascota_id})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@login_required
def api_update_mascota():
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()
        
    id = data.get('Id')
    if not id:
        return jsonify({"error": "Id required"}), 400
        
    conn = get_db_connection()
    try:
        repo = MascotaRepository(conn)
        
        data['FECHA_MODIFICACION'] = int(time.time() * 1000)
        data['USER_MODIFICACION'] = session.get('user_data', {}).get('Username', 'SYS')

        files = request.files.getlist('fotos')
        for file in files:
            if file and file.filename != '':
                filename = secure_filename(f"{id}_{file.filename}")
                file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
                url = f"/static/uploads/{filename}"
                repo.add_photo(id, url)

        data_to_update = {k: v for k, v in data.items() if k != 'Id'}

        repo.update(id, **data_to_update)
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

def register_routes(bp):
    
    bp.add_url_rule("/api/adm_mascota/GetAll", view_func=api_get_all_mascotas, methods=['GET'])
    bp.add_url_rule("/api/adm_mascota/Insert", view_func=api_insert_mascota, methods=['POST'])
    bp.add_url_rule("/api/adm_mascota/Update", view_func=api_update_mascota, methods=['PUT'])
    
    bp.add_url_rule("/api/admin/mascotas", view_func=api_insert_mascota, methods=['POST']) 