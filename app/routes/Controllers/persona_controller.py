from flask import jsonify
from db import get_db_connection
from auth.decorators import login_required

@login_required
def api_personas_available():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT P.Id, P.Nombres, P.Apellidos, P.DNI
            FROM Adm_Persona P
            LEFT JOIN Seg_Colaborador C ON P.Id = C.IdPersona
            WHERE C.Id IS NULL AND P.ESTADO = 1
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        return jsonify(rows)
    finally:
        conn.close()

def register_routes(bp):
    bp.add_url_rule("/api/admin/personas/available", view_func=api_personas_available, methods=['GET'])