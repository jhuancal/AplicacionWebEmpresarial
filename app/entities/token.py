from .base import Entidad

class TokenVerificacion(Entidad):
    def __init__(self, Id=None, Correo=None, Token=None, FechaExpiracion=None, **kwargs):
        super().__init__(**kwargs)
        self.Id = Id
        self.Correo = Correo
        self.Token = Token
        self.FechaExpiracion = FechaExpiracion

    def to_dict(self):
        return {
            'Id': self.Id,
            'Correo': self.Correo,
            'Token': self.Token,
            'FechaExpiracion': self.FechaExpiracion,
            'ESTADO': self.ESTADO,
            'DISPONIBILIDAD': self.DISPONIBILIDAD,
            'FECHA_CREACION': self.FECHA_CREACION,
            'FECHA_MODIFICACION': self.FECHA_MODIFICACION,
            'USER_CREACION': self.USER_CREACION,
            'USER_MODIFICACION': self.USER_MODIFICACION
        }

    @classmethod
    def from_dict(cls, data):
        return cls(**data)
