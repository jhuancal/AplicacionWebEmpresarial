from .base_repository import Repository
from entities.carrito import Carrito

class CarritoRepository(Repository):
    def __init__(self, conn):
        super().__init__(conn, Carrito, "Cli_Carrito")

    def get_by_client_with_products(self, id_cliente):
        cursor = self.conn.cursor(dictionary=True)
        sql = """
            SELECT c.*, p.Nombre as ProductoNombre, p.PrecioVenta, p.UrlImagen 
            FROM Cli_Carrito c
            JOIN Adm_Producto p ON c.IdProducto = p.Id
            WHERE c.IdCliente = %s
        """
        cursor.execute(sql, (id_cliente,))
        rows = cursor.fetchall()
        cursor.close()
        return rows

    def get_item(self, id_cliente, id_producto):
        cursor = self.conn.cursor(dictionary=True)
        sql = f"SELECT * FROM {self.table_name} WHERE IdCliente = %s AND IdProducto = %s"
        cursor.execute(sql, (id_cliente, id_producto))
        row = cursor.fetchone()
        cursor.close()
        return self.entity_class(**row) if row else None

    def clear_cart(self, id_cliente):
        cursor = self.conn.cursor()
        sql = f"DELETE FROM {self.table_name} WHERE IdCliente = %s"
        cursor.execute(sql, (id_cliente,))
        self.conn.commit()
        cursor.close()
        
    def remove_item(self, id_cliente, id_producto):
        cursor = self.conn.cursor()
        sql = f"DELETE FROM {self.table_name} WHERE IdCliente = %s AND IdProducto = %s"
        cursor.execute(sql, (id_cliente, id_producto))
        self.conn.commit()
        cursor.close()
        
    def update_quantity(self, id_cliente, id_producto, cantidad):
        cursor = self.conn.cursor()
        sql = f"UPDATE {self.table_name} SET Cantidad = %s WHERE IdCliente = %s AND IdProducto = %s"
        cursor.execute(sql, (cantidad, id_cliente, id_producto))
        self.conn.commit()
        cursor.close()