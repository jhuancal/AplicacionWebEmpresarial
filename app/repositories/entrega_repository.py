from .base_repository import Repository
from entities.entrega import Entrega

class EntregaRepository(Repository):
    def __init__(self, conn):
        super().__init__(conn, Entrega, "Cli_Entrega")
        
    def get_by_compra(self, id_compra):
        cursor = self.conn.cursor(dictionary=True)
        sql = f"SELECT * FROM {self.table_name} WHERE IdCompra = %s"
        cursor.execute(sql, (id_compra,))
        row = cursor.fetchone()
        cursor.close()
        return self.entity_class(**row) if row else None

    def update_status(self, id_compra, status):
        cursor = self.conn.cursor()
        sql = f"UPDATE {self.table_name} SET EstadoEntrega = %s WHERE IdCompra = %s"
        cursor.execute(sql, (status, id_compra))
        self.conn.commit()
        cursor.close()
