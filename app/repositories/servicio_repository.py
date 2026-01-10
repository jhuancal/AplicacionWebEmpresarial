from .base_repository import Repository
from entities.servicio import Servicio

class ServicioRepository(Repository):
    def __init__(self, conn):
        super().__init__(conn, Servicio, "Adm_Servicios")

    def update(self, id, **kwargs):
        cursor = self.conn.cursor()
        set_clause = ", ".join([f"{key} = %s" for key in kwargs.keys()])
        values = list(kwargs.values())
        values.append(id)
        
        sql = f"UPDATE {self.table_name} SET {set_clause} WHERE Id = %s"
        cursor.execute(sql, tuple(values))
        self.conn.commit()
        cursor.close()
