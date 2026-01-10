from repositories.cliente_repository import ClienteRepository
from repositories.colaborador_repository import ColaboradorRepository
from repositories.persona_repository import PersonaRepository
from repositories.mascota_repository import MascotaRepository
from db import get_db_connection
from datetime import datetime

class AuthService:
    @staticmethod
    def validate_user(username, password):
        conn = get_db_connection()
        try:
            # Check Colaborador
            colab_repo = ColaboradorRepository(conn)
            colab = colab_repo.get_by_username(username)
            if colab and colab['Contrasena'] == password:
                return True
            
            # Check Cliente
            client_repo = ClienteRepository(conn)
            client = client_repo.get_by_username(username)
            if client and client['Contrasena'] == password:
                return True
                
            return False
        finally:
            conn.close()

    @staticmethod
    def get_user_details(username):
        conn = get_db_connection()
        try:
            # Check Colaborador
            colab_repo = ColaboradorRepository(conn)
            colab = colab_repo.get_by_username(username)
            
            if colab:
                # Fetch Role Name and Persona Details
                cursor = conn.cursor(dictionary=True)
                query = """
                    SELECT R.Nombre as RolNombre, P.Nombres, P.Apellidos, P.DNI, P.Correo
                    FROM Seg_Colaborador C
                    LEFT JOIN Seg_Rol R ON C.IdRol = R.Id
                    LEFT JOIN Adm_Persona P ON C.IdPersona = P.Id
                    WHERE C.Id = %s
                """
                cursor.execute(query, (colab['Id'],))
                extra_data = cursor.fetchone()
                
                user_data = colab
                if extra_data:
                    user_data.update(extra_data)
                user_data['Tipo'] = 'Colaborador'
                return user_data

            # Check Cliente
            client_repo = ClienteRepository(conn)
            client = client_repo.get_by_username(username)
            
            if client:
                # Fetch Persona Details
                cursor = conn.cursor(dictionary=True)
                query = """
                    SELECT P.Nombres, P.Apellidos, P.DNI, P.Correo
                    FROM Seg_Cliente C
                    LEFT JOIN Adm_Persona P ON C.IdPersona = P.Id
                    WHERE C.Id = %s
                """
                cursor.execute(query, (client['Id'],))
                persona_data = cursor.fetchone()
                
                user_data = client
                if persona_data:
                    user_data.update(persona_data)
                user_data['Tipo'] = 'Cliente'
                return user_data

            return None
        finally:
            conn.close()

    @staticmethod
    def register_client(data):
        conn = get_db_connection()
        try:
            conn.start_transaction()
            
            persona_repo = PersonaRepository(conn)
            cliente_repo = ClienteRepository(conn)
            mascota_repo = MascotaRepository(conn)

            now = int(datetime.now().timestamp() * 1000)

            import uuid
            persona_id = str(uuid.uuid4())
            persona_repo.add(
                Id=persona_id,
                Nombres=data['nombres'],
                Apellidos=data['apellidos'],
                DNI=data['dni'],
                Correo=data['correo'],
                ESTADO=1,
                DISPONIBILIDAD=1,
                FECHA_CREACION=now,
                FECHA_MODIFICACION=now,
                USER_CREACION='SYS',
                USER_MODIFICACION='SYS'
            )

            cliente_id = str(uuid.uuid4())
            cliente_repo.add(
                Id=cliente_id,
                IdPersona=persona_id,
                NombreUsuario=data['username'],
                Contrasena=data['password'],
                NumeroCuenta=f"ACC-{data['username'].upper()}-{datetime.now().strftime('%Y%m%d')}",
                NumeroTarjeta=data.get('tarjeta', ''),
                ESTADO=1,
                DISPONIBILIDAD=1,
                FECHA_CREACION=now,
                FECHA_MODIFICACION=now,
                USER_CREACION='SYS',
                USER_MODIFICACION='SYS'
            )

            if 'mascota' in data and data['mascota']:
                m_data = data['mascota']
                mascota_repo.add(
                    Id=str(uuid.uuid4()),
                    IdCliente=cliente_id,
                    Nombre=m_data.get('nombre'),
                    Raza=m_data.get('raza'),
                    Tipo=m_data.get('tipo'),
                    FechaNacimiento=m_data.get('fecha_nacimiento'),
                    ESTADO=1,
                    DISPONIBILIDAD=1,
                    FECHA_CREACION=now,
                    FECHA_MODIFICACION=now,
                    USER_CREACION='SYS',
                    USER_MODIFICACION='SYS'
                )

            # Verify Token
            token_input = data.get('verification_code')
            if not token_input:
                return {"success": False, "message": "Verification code required"}
            
            from repositories.token_repository import TokenRepository
            token_repo = TokenRepository(conn)
            valid_token = token_repo.get_valid_token(data['correo'], token_input)
            
            if not valid_token:
                conn.rollback()
                return {"success": False, "message": "Invalid or expired verification code"}

            # Mark token as used
            token_repo.mark_used(valid_token.Id)

            conn.commit()
            return {"success": True, "message": "Registration successful"}
            
        except Exception as e:
            conn.rollback()
            print(f"Registration error: {e}")
            return {"success": False, "message": str(e)}
        finally:
            conn.close()

    @staticmethod
    def initiate_verification(email):
        conn = get_db_connection()
        try:
            # Check if email already exists? (Optional, maybe specific requirement)
            # For now just send code.
            
            import random
            import string
            from services.email_service import EmailService
            from repositories.token_repository import TokenRepository
            
            # Generate 6 char token (Upper + Digits)
            token = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            
            repo = TokenRepository(conn)
            repo.save_token(email, token)
            
            if EmailService.send_verification_email(email, token):
                return {"success": True, "message": "Verification code sent"}
            else:
                 return {"success": False, "message": "Failed to send email"}
        except Exception as e:
            print(f"Initiate verification error: {e}")
            return {"success": False, "message": str(e)}
        finally:
            conn.close()

    @staticmethod
    def verify_registration(data):
        conn = get_db_connection()
        try:
            email = data.get('correo')
            token_input = data.get('verification_code')
            
            from repositories.token_repository import TokenRepository
            repo = TokenRepository(conn)
            
            valid_token = repo.get_valid_token(email, token_input)
            
            if not valid_token:
                return {"success": False, "message": "Invalid or expired verification code"}
            
            # Token valid, proceed to register
            # This method can be used just for checking, but register_client does the actual work.
            # We will use this simply to validate if needed, but register_client now handles it.
            if valid_token:
                 return {"success": True, "message": "Token valid"}
            return {"success": False, "message": "Invalid token"}
        finally:
            conn.close()
