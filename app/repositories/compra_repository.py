from .base_repository import Repository
from entities.compra import Compra, DetalleCompra

class CompraRepository(Repository):
    def __init__(self, conn):
        super().__init__(conn, Compra, "Cli_Compras")

    def create_with_details(self, compra_dict, detalles_list):
        cursor = self.conn.cursor()
        try:
            # Create Compra
            keys = ", ".join(compra_dict.keys())
            placeholders = ", ".join(["%s"] * len(compra_dict))
            sql = f"INSERT INTO {self.table_name} ({keys}) VALUES ({placeholders})"
            cursor.execute(sql, tuple(compra_dict.values()))

            # Create Detalles
            for detalle in detalles_list:
                d_keys = ", ".join(detalle.keys())
                d_placeholders = ", ".join(["%s"] * len(detalle))
                d_sql = f"INSERT INTO Cli_DetalleCompra ({d_keys}) VALUES ({d_placeholders})"
                cursor.execute(d_sql, tuple(detalle.values()))
            
            self.conn.commit()
            return True
        except Exception as e:
            self.conn.rollback()
            print(f"Error creating purchase: {e}")
            return False
        finally:
            cursor.close()

    def get_history_by_client(self, id_cliente):
        cursor = self.conn.cursor(dictionary=True)
        sql = f"SELECT * FROM {self.table_name} WHERE IdCliente = %s ORDER BY FechaCompra DESC"
        cursor.execute(sql, (id_cliente,))
        rows = cursor.fetchall()
        cursor.close()
        return [self.entity_class(**row) for row in rows]
    
    def get_details(self, id_compra):
        cursor = self.conn.cursor(dictionary=True)
        sql = "SELECT * FROM Cli_DetalleCompra WHERE IdCompra = %s"
        cursor.execute(sql, (id_compra,))
        rows = cursor.fetchall()
        cursor.close()
        return [DetalleCompra(**row) for row in rows]

    def update_status(self, id_compra, status):
        cursor = self.conn.cursor()
        sql = f"UPDATE {self.table_name} SET Estado = %s WHERE Id = %s"
        cursor.execute(sql, (status, id_compra))
        self.conn.commit()
        cursor.close()
