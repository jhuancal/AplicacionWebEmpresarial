from .base import Entidad

class Cliente(Entidad):
    def __init__(self, Id=None, IdPersona=None, NombreUsuario=None, Contrasena=None, NumeroCuenta=None, NumeroTarjeta=None, **kwargs):
        super().__init__(**kwargs)
        self.Id = Id
        self.IdPersona = IdPersona
        self.NombreUsuario = NombreUsuario
        self.Contrasena = Contrasena
        self.NumeroCuenta = NumeroCuenta
        self.NumeroTarjeta = NumeroTarjeta

    def to_dict(self):
        return {
            'Id': self.Id,
            'IdPersona': self.IdPersona,
            'NombreUsuario': self.NombreUsuario,
            'Contrasena': self.Contrasena,
            'NumeroCuenta': self.NumeroCuenta,
            'NumeroTarjeta': self.NumeroTarjeta,
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
