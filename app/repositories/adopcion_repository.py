from .base_repository import Repository
from entities.adopcion_solicitud import AdopcionSolicitud

class AdopcionRepository(Repository):
    def __init__(self, conn):
        super().__init__(conn, AdopcionSolicitud, "Adopcion_Solicitud")

    def get_by_cliente(self, id_cliente):
        cursor = self.conn.cursor(dictionary=True)
        query = f"SELECT * FROM {self.table_name} WHERE IdCliente = %s"
        cursor.execute(query, (id_cliente,))
        rows = cursor.fetchall()
        cursor.close()
        return [self.entity_class(**row) for row in rows]

    def get_by_mascota(self, id_mascota):
        cursor = self.conn.cursor(dictionary=True)
        query = f"SELECT * FROM {self.table_name} WHERE IdMascota = %s"
        cursor.execute(query, (id_mascota,))
        rows = cursor.fetchall()
        cursor.close()
        return [self.entity_class(**row) for row in rows]
    
    def update_estado(self, id_solicitud, nuevo_estado, user_mod):
        import time
        cursor = self.conn.cursor()
        query = f"UPDATE {self.table_name} SET EstadoSolicitud = %s, USER_MODIFICACION = %s, FECHA_MODIFICACION = %s WHERE Id = %s"
        cursor.execute(query, (nuevo_estado, user_mod, int(time.time() * 1000), id_solicitud))
        self.conn.commit()
        cursor.close()

    def get_all_detailed(self):
        cursor = self.conn.cursor(dictionary=True)
        query = """
            SELECT s.*, 
                   c.Nombres as ClienteNombre, c.Apellidos as ClienteApellido, 
                   m.Nombre as MascotaNombre
            FROM Adopcion_Solicitud s
            JOIN Seg_Cliente c ON s.IdCliente = c.Id
            JOIN Adm_Mascota m ON s.IdMascota = m.Id
            WHERE s.ESTADO = 1
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()
        results = []
        for row in rows:
            obj = self.entity_class(**{k:v for k,v in row.items() if k in self.entity_class.__init__.__code__.co_varnames})
            d = obj.to_dict()
            d['ClienteNombre'] = row['ClienteNombre']
            d['ClienteApellido'] = row['ClienteApellido']
            d['MascotaNombre'] = row['MascotaNombre']
            results.append(d)
        return results