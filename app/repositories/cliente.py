from .base import Repository
from entities.cliente import Cliente

class ClienteRepository(Repository):
    def __init__(self, conn):
        super().__init__(conn, Cliente)
        self.table_name = "Seg_Cliente"
        self.base_table = "Seg_Usuario"

    def get_all(self):
        cursor = self.conn.cursor(dictionary=True)
        # Join User and Client
        query = f"""
            SELECT U.*, C.NumeroCuenta
            FROM {self.base_table} U
            JOIN {self.table_name} C ON U.Id = C.Id
            WHERE U.ESTADO = 1
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        return [self.entity_class(**row) for row in rows]

    def add(self, **kwargs):
        cursor = self.conn.cursor()
        
        # Split fields for Usuario and Cliente
        # Usuario Fields
        usuario_fields = ['Id', 'NombreUsuario', 'Contrasena', 'IdPersona', 'ESTADO', 'DISPONIBILIDAD', 'FECHA_CREACION', 'FECHA_MODIFICACION', 'USER_CREACION', 'USER_MODIFICACION']
        usuario_data = {k: v for k, v in kwargs.items() if k in usuario_fields}
        
        # Cliente Fields
        cliente_fields = ['Id', 'NumeroCuenta', 'ESTADO', 'DISPONIBILIDAD', 'FECHA_CREACION', 'FECHA_MODIFICACION', 'USER_CREACION', 'USER_MODIFICACION']
        cliente_data = {k: v for k, v in kwargs.items() if k in cliente_fields}

        # Insert Usuario
        columns_u = ", ".join(usuario_data.keys())
        placeholders_u = ", ".join(["%s"] * len(usuario_data))
        sql_u = f"INSERT INTO {self.base_table} ({columns_u}) VALUES ({placeholders_u})"
        cursor.execute(sql_u, list(usuario_data.values()))

        # Insert Cliente
        columns_c = ", ".join(cliente_data.keys())
        placeholders_c = ", ".join(["%s"] * len(cliente_data))
        sql_c = f"INSERT INTO {self.table_name} ({columns_c}) VALUES ({placeholders_c})"
        cursor.execute(sql_c, list(cliente_data.values()))

        self.conn.commit()
    
    # Needs update and delete overrides too for full support, but skipping for brevity of this specific request unless user asks for full CRUD immediately. 
    # Just implementing basic inheritance structure.
