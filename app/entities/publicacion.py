from .base import Entidad

class Publicacion(Entidad):
    def __init__(self, Id=None, IdCliente=None, Contenido=None, FechaPublicacion=None, Likes=0, **kwargs):
        super().__init__(**kwargs)
        self.Id = Id
        self.IdCliente = IdCliente
        self.Contenido = Contenido
        self.FechaPublicacion = FechaPublicacion
        self.Likes = Likes

    def to_dict(self):
        return {
            'Id': self.Id,
            'IdCliente': self.IdCliente,
            'Contenido': self.Contenido,
            'FechaPublicacion': self.FechaPublicacion,
            'Likes': self.Likes,
            'ESTADO': self.ESTADO,
            'RowVersion': self.RowVersion,
            'DISPONIBILIDAD': self.DISPONIBILIDAD,
            'FECHA_CREACION': self.FECHA_CREACION,
            'FECHA_MODIFICACION': self.FECHA_MODIFICACION,
            'USER_CREACION': self.USER_CREACION,
            'USER_MODIFICACION': self.USER_MODIFICACION
        }

