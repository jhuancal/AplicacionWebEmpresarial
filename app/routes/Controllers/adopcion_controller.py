from flask import Blueprint, request, jsonify, session, render_template
from repositories.adopcion_repository import AdopcionRepository
from repositories.mascota_repository import MascotaRepository
from db import get_db_connection
from services.email_service import EmailService
import uuid

def register_routes(bp):

    @bp.route("/api/adopcion/solicitar", methods=['POST'])
    def solicitar_adopcion():
        user = session.get('user_data')
        if not user:
            return jsonify({"success": False, "message": "Debe iniciar sesión"}), 401
        
        data = request.get_json()
        id_mascota = data.get('id_mascota')
        
        if not id_mascota:
            return jsonify({"success": False, "message": "Mascota no especificada"}), 400
        
        conn = get_db_connection()
        try:
            repo = AdopcionRepository(conn)
            # Check if already requested? (Optional rule)
            
            new_request = {
                'Id': str(uuid.uuid4()),
                'IdCliente': user['Id'],
                'IdMascota': id_mascota,
                'FechaSolicitud': int(uuid.uuid1().time), # timestamp approximation or use time.time
                'EstadoSolicitud': 'Nueva',
                'Observacion': '',
                'ESTADO': 1,
                'DISPONIBILIDAD': 1,
                'FECHA_CREACION': 0,
                'FECHA_MODIFICACION': 0,
                'USER_CREACION': user.get('Username', 'User'),
                'USER_MODIFICACION': user.get('Username', 'User')
            }
            # Fix timestamp
            import time
            now = int(time.time() * 1000)
            new_request['FechaSolicitud'] = now
            new_request['FECHA_CREACION'] = now
            new_request['FECHA_MODIFICACION'] = now
            
            repo.add(**new_request)
            
            # Send notification?
            # EmailService.send_adoption_request_received(user['Correo']) # Hypothetical
            
            return jsonify({"success": True, "message": "Solicitud enviada correctamente"})
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500
        finally:
            conn.close()

    @bp.route("/api/admin/adopcion/all", methods=['GET'])
    def get_all_solicitudes():
        # Check admin role? Decorator usually handles this.
        conn = get_db_connection()
        try:
            repo = AdopcionRepository(conn)
            data = repo.get_all_detailed()
            return jsonify(data)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            conn.close()

    @bp.route("/api/admin/adopcion/approve", methods=['POST'])
    def approve_adopcion():
        data = request.get_json()
        id_solicitud = data.get('Id')
        
        conn = get_db_connection()
        try:
            repo = AdopcionRepository(conn)
            repo_mascota = MascotaRepository(conn)
            
            # Get Request to find Mascota
            solicitud = repo.get_by_id(id_solicitud)
            if not solicitud:
                return jsonify({"success": False, "message": "Solicitud no encontrada"}), 404
            
            # Update Request
            repo.update_estado(id_solicitud, 'Aprobada', 'ADMIN')
            
            # Update Mascota (Adoptada = 0 - Unavailable)
            # We need method in MascotaRepository
            repo_mascota.update_availability(solicitud.IdMascota, 0, 'ADMIN') 
            # Assuming we add this method. If not, raw update or different approach.
            
            # Notify User logic here (EmailService)
            
            return jsonify({"success": True})
        except Exception as e:
            print(e)
            return jsonify({"success": False, "message": str(e)}), 500
        finally:
            conn.close()

    @bp.route("/api/admin/adopcion/reject", methods=['POST'])
    def reject_adopcion():
        data = request.get_json()
        id_solicitud = data.get('Id')
        
        conn = get_db_connection()
        try:
            repo = AdopcionRepository(conn)
            repo.update_estado(id_solicitud, 'Rechazada', 'ADMIN')
            return jsonify({"success": True})
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500
        finally:
            conn.close()
