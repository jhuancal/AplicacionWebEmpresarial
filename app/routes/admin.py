from flask import Blueprint, render_template, session, request
from db import get_db_connection
from auth.decorators import login_required
from repositories.producto_repository import ProductoRepository

# Import controllers
from routes.Controllers.base_controller import register_routes as register_base_routes
from routes.Controllers.producto_controller import register_routes as register_producto_routes
from routes.Controllers.mascota_controller import register_routes as register_mascota_routes
from routes.Controllers.persona_controller import register_routes as register_persona_routes
from routes.Controllers.rol_controller import register_routes as register_rol_routes
from routes.Controllers.servicio_controller import register_routes as register_servicio_routes
from routes.Controllers.reserva_controller import register_routes as register_reserva_routes
from routes.Controllers.seguridad_controller import register_routes as register_seguridad_routes
from routes.Controllers.adopcion_controller import register_routes as register_adopcion_routes

admin_bp = Blueprint('admin', __name__)

# Register Routes from Controllers
register_base_routes(admin_bp)
register_producto_routes(admin_bp)
register_mascota_routes(admin_bp)
register_persona_routes(admin_bp)
register_rol_routes(admin_bp)
register_servicio_routes(admin_bp)
register_reserva_routes(admin_bp)
register_seguridad_routes(admin_bp)
register_adopcion_routes(admin_bp)

@admin_bp.route("/admin/dashboard")
@login_required
def dashboard():
    user = session.get('user_data')
    return render_template("admin/dashboard.html", user=user)

@admin_bp.route("/admin/administracion/producto")
@login_required
def admin_producto():
    user = session.get('user_data')
    return render_template("admin/Administracion/producto.html", user=user)

@admin_bp.route("/admin/administracion/persona")
@login_required
def admin_persona():
    user = session.get('user_data')
    return render_template("admin/Administracion/persona.html", user=user)

@admin_bp.route("/admin/administracion/mascotas")
@login_required
def admin_mascotas():
    user = session.get('user_data')
    return render_template("admin/Administracion/mascotas.html", user=user)

@admin_bp.route('/admin/seguridad/roles_permisos')
@login_required
def roles_permisos():
    user = session.get('user_data')
    return render_template('admin/Seguridad/roles_permisos.html', user=user)

@admin_bp.route('/admin/seguridad/usuario_rol')
@login_required
def usuario_rol():
    user = session.get('user_data')
    return render_template('admin/Seguridad/usuario_rol.html', user=user)

@admin_bp.route('/admin/seguridad/vistas')
@login_required
def vistas():
    user = session.get('user_data')
    return render_template('admin/Seguridad/vistas.html', user=user)

@admin_bp.route('/admin/adopcion/solicitudes')
@login_required
def solicitudes_adopcion():
    user = session.get('user_data')
    return render_template('admin/Clientes/solicitudes_adopcion.html', user=user)

@admin_bp.route("/admin/seguridad/cliente")
@login_required
def admin_cliente():
    user = session.get('user_data')
    return render_template("admin/Seguridad/cliente.html", user=user)

@admin_bp.route("/admin/seguridad/colaborador")
@login_required
def admin_colaborador():
    user = session.get('user_data')
    return render_template("admin/Seguridad/colaborador.html", user=user)

@admin_bp.route("/admin/administracion/servicios")
@login_required
def admin_servicios():
    user = session.get('user_data')
    return render_template("admin/Administracion/servicios.html", user=user)

@admin_bp.route("/admin/clientes/reservas")
@login_required
def admin_reservas():
    user = session.get('user_data')
    return render_template("admin/Clientes/reservas.html", user=user)

@admin_bp.route("/admin/clientes/compras")
@login_required
def admin_compras():
    user = session.get('user_data')
    return render_template("admin/Clientes/compras.html", user=user)

@admin_bp.route("/admin/clientes/carritos")
@login_required
def admin_carritos():
    user = session.get('user_data')
    return render_template("admin/Clientes/carritos.html", user=user)

@admin_bp.route("/admin/clientes/publicaciones")
@login_required
def admin_publicaciones():
    user = session.get('user_data')
    return render_template("admin/Clientes/publicaciones.html", user=user)

