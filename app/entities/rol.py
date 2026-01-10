from .base import Entidad

class Rol(Entidad):
    def __init__(self, Id=None, Nombre=None, Descripcion=None, **kwargs):
        super().__init__(**kwargs)
        self.Id = Id
        self.Nombre = Nombre
        self.Descripcion = Descripcion
    
    def to_dict(self):
        return {
            'Id': self.Id,
            'Nombre': self.Nombre,
            'Descripcion': self.Descripcion,
            'ESTADO': self.ESTADO,
            'DISPONIBILIDAD': self.DISPONIBILIDAD,
            'FECHA_CREACION': self.FECHA_CREACION,
            'FECHA_MODIFICACION': self.FECHA_MODIFICACION,
            'USER_CREACION': self.USER_CREACION,
            'USER_MODIFICACION': self.USER_MODIFICACION
        }
