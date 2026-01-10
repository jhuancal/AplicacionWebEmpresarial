from .base_repository import Repository
from entities.mascota import Mascota

class MascotaRepository(Repository):
    def __init__(self, conn):
        super().__init__(conn, Mascota, "Adm_Mascota")

    def get_by_cliente(self, id_cliente):
        cursor = self.conn.cursor(dictionary=True)
        query = f"SELECT * FROM {self.table_name} WHERE IdCliente = %s"
        cursor.execute(query, (id_cliente,))
        rows = cursor.fetchall()
        cursor.close()
        return [self.entity_class(**row) for row in rows]

    def add_photo(self, id_mascota, url):
        import uuid
        from datetime import datetime
        cursor = self.conn.cursor()
        query = """
            INSERT INTO Adm_Mascota_Foto (Id, IdMascota, Url, ESTADO, DISPONIBILIDAD, FECHA_CREACION, FECHA_MODIFICACION, USER_CREACION, USER_MODIFICACION)
            VALUES (%s, %s, %s, 1, 1, %s, %s, 'SYS', 'SYS')
        """
        now = int(datetime.now().timestamp() * 1000)
        cursor.execute(query, (str(uuid.uuid4()), id_mascota, url, now, now))
        self.conn.commit()
        cursor.close()

    def get_photos(self, id_mascota):
        cursor = self.conn.cursor(dictionary=True)
        query = "SELECT Url FROM Adm_Mascota_Foto WHERE IdMascota = %s"
        cursor.execute(query, (id_mascota,))
        rows = cursor.fetchall()
        cursor.close()
        return [r['Url'] for r in rows]

    def get_all_with_photos(self):
        pets = self.get_all()
        for pet in pets:
            pet.Fotos = self.get_photos(pet.Id)
        return pets

    def update_availability(self, id_mascota, availability, user_mod):
        import time
        cursor = self.conn.cursor()
        query = f"UPDATE {self.table_name} SET DISPONIBILIDAD = %s, USER_MODIFICACION = %s, FECHA_MODIFICACION = %s WHERE Id = %s"
        cursor.execute(query, (availability, user_mod, int(time.time() * 1000), id_mascota))
        self.conn.commit()
        cursor.close()
