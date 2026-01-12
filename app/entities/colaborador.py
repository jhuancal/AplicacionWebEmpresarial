from .base import Entidad

class Colaborador(Entidad):
    def __init__(self, Id=None, IdPersona=None, NombreUsuario=None, Contrasena=None, IdRol=None, EsActivo=None, FechaContratacion=None, **kwargs):
        super().__init__(**kwargs)
        self.Id = Id
        self.IdPersona = IdPersona
        self.NombreUsuario = NombreUsuario
        self.Contrasena = Contrasena
        self.IdRol = IdRol
        self.EsActivo = EsActivo
        self.FechaContratacion = FechaContratacion

    def to_dict(self):
        return {
            'Id': self.Id,
            'IdPersona': self.IdPersona,
            'NombreUsuario': self.NombreUsuario,
            'Contrasena': self.Contrasena,
            'IdRol': self.IdRol,
            'EsActivo': self.EsActivo,
            'FechaContratacion': self.FechaContratacion,
            'ESTADO': self.ESTADO,
            'DISPONIBILIDAD': self.DISPONIBILIDAD,
            'FECHA_CREACION': self.FECHA_CREACION,
            'FECHA_MODIFICACION': self.FECHA_MODIFICACION,
            'USER_CREACION': self.USER_CREACION,
            'USER_MODIFICACION': self.USER_MODIFICACION
        }