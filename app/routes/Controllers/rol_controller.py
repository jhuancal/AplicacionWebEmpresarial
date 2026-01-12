from flask import jsonify
from db import get_db_connection
from auth.decorators import login_required
from repositories.rol_repository import RolRepository

@login_required
def api_roles_all():
    conn = get_db_connection()
    try:
        repo = RolRepository(conn)
        roles = repo.get_all()
        return jsonify([r.to_dict() for r in roles])
    finally:
        conn.close()

def register_routes(bp):
    bp.add_url_rule("/api/admin/roles/all", view_func=api_roles_all, methods=['GET'])