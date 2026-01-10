from .base_repository import Repository
from entities.rol_acceso import RolAcceso

class RolAccesoRepository(Repository):
    def __init__(self, conn):
        super().__init__(conn, RolAcceso, "Seg_Rol_Acceso")

    def get_by_rol_id(self, rol_id):
        cursor = self.conn.cursor(dictionary=True)
        query = f"SELECT * FROM {self.table_name} WHERE IdRol = %s AND ESTADO = 1"
        cursor.execute(query, (rol_id,))
        rows = cursor.fetchall()
        cursor.close()
        return [self.entity_class(**row) for row in rows]
    
    def delete_by_rol_id(self, rol_id):
        cursor = self.conn.cursor()
        query = f"DELETE FROM {self.table_name} WHERE IdRol = %s"
        cursor.execute(query, (rol_id,))
        self.conn.commit()
        cursor.close()
