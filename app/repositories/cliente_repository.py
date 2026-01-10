from .base_repository import Repository
from entities.cliente import Cliente

class ClienteRepository(Repository):
    def __init__(self, conn):
        super().__init__(conn, Cliente, "Seg_Cliente")
        self.table_name = "Seg_Cliente"

    def get_all(self):
        cursor = self.conn.cursor(dictionary=True)
        query = f"""
            SELECT C.*, P.Nombres, P.Apellidos
            FROM {self.table_name} C
            LEFT JOIN Adm_Persona P ON C.IdPersona = P.Id
            WHERE C.ESTADO = 1
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        return [self.entity_class.from_dict({**row, 'NombreCompleto': f"{row['Nombres']} {row['Apellidos']}"}) for row in rows]
        
    def add(self, **kwargs):
        cursor = self.conn.cursor()
        fields = ['Id', 'IdPersona', 'NombreUsuario', 'Contrasena', 'NumeroCuenta', 'NumeroTarjeta', 'ESTADO', 'DISPONIBILIDAD', 'FECHA_CREACION', 'FECHA_MODIFICACION', 'USER_CREACION', 'USER_MODIFICACION']
        data = {k: v for k, v in kwargs.items() if k in fields}
        
        columns = ", ".join(data.keys())
        placeholders = ", ".join(["%s"] * len(data))
        sql = f"INSERT INTO {self.table_name} ({columns}) VALUES ({placeholders})"
        cursor.execute(sql, list(data.values()))
        self.conn.commit()

    def update(self, id, **kwargs):
        cursor = self.conn.cursor()
        fields = ['IdPersona', 'NombreUsuario', 'Contrasena', 'NumeroCuenta', 'NumeroTarjeta', 'ESTADO', 'DISPONIBILIDAD', 'FECHA_CREACION', 'FECHA_MODIFICACION', 'USER_CREACION', 'USER_MODIFICACION']
        data = {k: v for k, v in kwargs.items() if k in fields}
        
        if data:
            set_clause = ", ".join([f"{k}=%s" for k in data.keys()])
            sql = f"UPDATE {self.table_name} SET {set_clause} WHERE Id=%s"
            cursor.execute(sql, list(data.values()) + [id])

        self.conn.commit()
        cursor.close()

    def count_all(self, filters=None):
        cursor = self.conn.cursor()
        where_clause = "WHERE C.ESTADO = 1"
        params = []
        if filters:
            conditions = []
            for f in filters:
                prop = f.get('PropertyName')
                val = f.get('Value')
                op = f.get('Operator')
                if prop and val:
                    if op == 'Contains':
                        conditions.append(f"{prop} LIKE %s")
                        params.append(f"%{val}%")
            if conditions:
                where_clause += " AND " + " AND ".join(conditions)
        
        sql = f"SELECT COUNT(*) FROM {self.table_name} C LEFT JOIN Adm_Persona P ON C.IdPersona = P.Id {where_clause}"
        cursor.execute(sql, tuple(params))
        count = cursor.fetchone()[0]
        cursor.close()
        return count

    def get_paged(self, start_index, length, filters=None, order=None):
        cursor = self.conn.cursor(dictionary=True)
        where_clause = "WHERE C.ESTADO = 1"
        params = []
        
        if filters:
            conditions = []
            for f in filters:
                prop = f.get('PropertyName')
                val = f.get('Value')
                op = f.get('Operator')
                if prop and val:
                    if op == 'Contains':
                        conditions.append(f"{prop} LIKE %s")
                        params.append(f"%{val}%")
            if conditions:
                where_clause += " AND " + " AND ".join(conditions)

        order_clause = ""
        if order:
            o_list = []
            for o in order:
                prop = o.get('Property')
                direction = o.get('OrderType')
                if prop:
                   o_list.append(f"{prop} {direction}")
            if o_list:
                order_clause = "ORDER BY " + ", ".join(o_list)

        limit_clause = f"LIMIT {length} OFFSET {start_index}"
        
        query = f"""
            SELECT C.*, P.Nombres, P.Apellidos
            FROM {self.table_name} C
            LEFT JOIN Adm_Persona P ON C.IdPersona = P.Id
            {where_clause} {order_clause} {limit_clause}
        """
        cursor.execute(query, tuple(params))
        rows = cursor.fetchall()
        cursor.close()
        results = []
        for row in rows:
            obj = self.entity_class.from_dict(row)
            obj_dict = obj.to_dict()
            obj_dict['NombreCompleto'] = f"{row.get('Nombres','')} {row.get('Apellidos','')}".strip()
            results.append(obj_dict)
        return results

    def get_by_username(self, username):
        cursor = self.conn.cursor(dictionary=True)
        query = f"SELECT * FROM {self.table_name} WHERE NombreUsuario = %s AND ESTADO = 1"
        cursor.execute(query, (username,))
        return cursor.fetchone()
