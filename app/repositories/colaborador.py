from .base import Repository
from entities.colaborador import Colaborador

class ColaboradorRepository(Repository):
    def __init__(self, conn):
        super().__init__(conn, Colaborador)
        self.table_name = "Seg_Colaborador"
        self.base_table = "Seg_Usuario"

    def get_all(self):
        cursor = self.conn.cursor(dictionary=True)
        query = f"""
            SELECT U.*, C.IdRol, C.EsActivo, C.FechaContratacion
            FROM {self.base_table} U
            JOIN {self.table_name} C ON U.Id = C.Id
            WHERE U.ESTADO = 1
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        return [self.entity_class(**row) for row in rows]

    def add(self, **kwargs):
        cursor = self.conn.cursor()
        
        # Split fields
        usuario_fields = ['Id', 'NombreUsuario', 'Contrasena', 'IdPersona', 'ESTADO', 'DISPONIBILIDAD', 'FECHA_CREACION', 'FECHA_MODIFICACION', 'USER_CREACION', 'USER_MODIFICACION']
        usuario_data = {k: v for k, v in kwargs.items() if k in usuario_fields}
        
        colaborador_fields = ['Id', 'IdRol', 'EsActivo', 'FechaContratacion', 'ESTADO', 'DISPONIBILIDAD', 'FECHA_CREACION', 'FECHA_MODIFICACION', 'USER_CREACION', 'USER_MODIFICACION']
        colaborador_data = {k: v for k, v in kwargs.items() if k in colaborador_fields}

        # Insert Usuario
        # Enforce "ws_" prefix for Colaborador username
        if 'NombreUsuario' in usuario_data:
            if not usuario_data['NombreUsuario'].startswith('ws_'):
                usuario_data['NombreUsuario'] = 'ws_' + usuario_data['NombreUsuario']

        columns_u = ", ".join(usuario_data.keys())
        placeholders_u = ", ".join(["%s"] * len(usuario_data))
        sql_u = f"INSERT INTO {self.base_table} ({columns_u}) VALUES ({placeholders_u})"
        cursor.execute(sql_u, list(usuario_data.values()))

        # Insert Colaborador
        columns_c = ", ".join(colaborador_data.keys())
        placeholders_c = ", ".join(["%s"] * len(colaborador_data))
        sql_c = f"INSERT INTO {self.table_name} ({columns_c}) VALUES ({placeholders_c})"
        cursor.execute(sql_c, list(colaborador_data.values()))

        self.conn.commit()
