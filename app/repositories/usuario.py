from .base import Repository
from entities.usuario import Usuario

class UsuarioRepository(Repository):
    def __init__(self, conn):
        super().__init__(conn, Usuario, "Seg_Usuario")

    def get_by_username(self, username):
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute(f"SELECT * FROM {self.table_name} WHERE NombreUsuario = %s", (username,))
        row = cursor.fetchone()
        cursor.close()
        return self.entity_class(**row) if row else None
