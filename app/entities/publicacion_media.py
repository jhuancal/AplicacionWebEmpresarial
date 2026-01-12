from .base import Entidad

class PublicacionMedia(Entidad):
    def __init__(self, Id=None, IdPublicacion=None, Url=None, TipoMedia=None, **kwargs):
        super().__init__(**kwargs)
        self.Id = Id
        self.IdPublicacion = IdPublicacion
        self.Url = Url
        self.TipoMedia = TipoMedia

    def to_dict(self):
        return {
            'Id': self.Id,
            'IdPublicacion': self.IdPublicacion,
            'Url': self.Url,
            'TipoMedia': self.TipoMedia,
            'ESTADO': self.ESTADO,
            'RowVersion': self.RowVersion,
            'DISPONIBILIDAD': self.DISPONIBILIDAD,
            'FECHA_CREACION': self.FECHA_CREACION,
            'FECHA_MODIFICACION': self.FECHA_MODIFICACION,
            'USER_CREACION': self.USER_CREACION,
            'USER_MODIFICACION': self.USER_MODIFICACION
        }
