from .base_repository import Repository
from entities.token import TokenVerificacion
from datetime import datetime
import uuid

class TokenRepository(Repository):
    def __init__(self, connection):
        super().__init__(connection, TokenVerificacion, "Seg_TokenVerificacion")
        self.table_name = "Seg_TokenVerificacion"

    def invalidate_previous_tokens(self, correo):
        query = f"UPDATE {self.table_name} SET ESTADO = 0 WHERE Correo = %s AND ESTADO = 1"
        cursor = self.conn.cursor()
        cursor.execute(query, (correo,))
        self.conn.commit()

    def save_token(self, correo, token):
        # Invalidate previous tokens
        self.invalidate_previous_tokens(correo)
        
        # 10 minutes expiration
        now_ms = int(datetime.now().timestamp() * 1000)
        expiration = now_ms + (10 * 60 * 1000) 
        
        new_token = TokenVerificacion(
            Id=str(uuid.uuid4()),
            Correo=correo,
            Token=token,
            FechaExpiracion=expiration,
            ESTADO=1,
            DISPONIBILIDAD=1,
            FECHA_CREACION=now_ms,
            FECHA_MODIFICACION=now_ms,
            USER_CREACION='SYS',
            USER_MODIFICACION='SYS'
        )
        self.add(**new_token.to_dict())
        return new_token

    def get_valid_token(self, correo, token):
        now_ms = int(datetime.now().timestamp() * 1000)
        query = f"""
            SELECT * FROM {self.table_name} 
            WHERE Correo = %s 
            AND Token = %s 
            AND ESTADO = 1 
            AND FechaExpiracion > %s
        """
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute(query, (correo, token, now_ms))
        result = cursor.fetchone()
        if result:
            return TokenVerificacion.from_dict(result)
        return None

    def mark_used(self, token_id):
        query = f"UPDATE {self.table_name} SET ESTADO = 0 WHERE Id = %s"
        cursor = self.conn.cursor()
        cursor.execute(query, (token_id,))
        self.conn.commit()
