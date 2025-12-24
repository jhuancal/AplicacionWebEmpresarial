from repositories.usuario import UsuarioRepository
from repositories.cliente import ClienteRepository
from repositories.colaborador import ColaboradorRepository
from repositories.persona import PersonaRepository
from db import get_db_connection

class AuthService:
    @staticmethod
    def validate_user(username, password):
        conn = get_db_connection()
        try:
            repo = UsuarioRepository(conn)
            user = repo.get_by_username(username)
            if user and user['Contrasena'] == password:
                return True
            return False
        finally:
            conn.close()

    @staticmethod
    def get_user_details(username):
        conn = get_db_connection()
        try:
            user_repo = UsuarioRepository(conn)
            base_user = user_repo.get_by_username(username)
            
            if not base_user:
                return None
            
            user_data = base_user
            
            is_collaborator = username.startswith('ws_')
            if is_collaborator:
                cursor = conn.cursor(dictionary=True)
                query = """
                    SELECT C.IdRol, C.EsActivo, C.FechaContratacion, R.Nombre as RolNombre
                    FROM Seg_Colaborador C
                    LEFT JOIN Seg_Rol R ON C.IdRol = R.Id
                    WHERE C.Id = %s
                """
                cursor.execute(query, (base_user['Id'],))
                collab_data = cursor.fetchone()
                if collab_data:
                    user_data.update(collab_data)
                    user_data['Tipo'] = 'Colaborador'
            else:
                cursor = conn.cursor(dictionary=True)
                query = "SELECT NumeroCuenta FROM Seg_Cliente WHERE Id = %s"
                cursor.execute(query, (base_user['Id'],))
                client_data = cursor.fetchone()
                if client_data:
                    user_data.update(client_data)
                    user_data['Tipo'] = 'Cliente'
            if base_user.get('IdPersona'):
                cursor = conn.cursor(dictionary=True)
                query = "SELECT Nombres, Apellidos, DNI, Correo FROM Adm_Persona WHERE Id = %s"
                cursor.execute(query, (base_user['IdPersona'],))
                persona_data = cursor.fetchone()
                if persona_data:
                    user_data.update(persona_data)
            
            return user_data
            
        finally:
            conn.close()
