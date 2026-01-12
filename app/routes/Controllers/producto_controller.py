from flask import request, redirect, url_for
from db import get_db_connection
from auth.decorators import login_required
from repositories.producto_repository import ProductoRepository

@login_required
def update_product(id):
    name = request.form['name']
    description = request.form['description']
    price_regular = request.form['price_regular']
    price_sale = request.form['price_sale']
    discount = request.form['discount']
    arrival_day = request.form['arrival_day']
    image_url = request.form['image_url']

    conn = get_db_connection()
    repo = ProductoRepository(conn)
    repo.update(id, 
                Nombre=name, 
                Descripcion=description, 
                PrecioRegular=price_regular, 
                PrecioVenta=price_sale, 
                Descuento=discount, 
                DiaLlegada=arrival_day, 
                UrlImagen=image_url)
    conn.close()
    return redirect(url_for('admin.dashboard'))

def register_routes(bp):
    bp.add_url_rule("/update_product/<string:id>", view_func=update_product, methods=['POST'])