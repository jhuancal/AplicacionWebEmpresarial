from .base import Entidad

class Entrega(Entidad):
    def __init__(self, Id=None, IdCompra=None, ResponsableEntrega=None, TelefonoResponsable=None, FechaEstimada=None, FechaEntrega=None, EstadoEntrega=None, Observaciones=None, **kwargs):
        super().__init__(**kwargs)
        self.Id = Id
        self.IdCompra = IdCompra
        self.ResponsableEntrega = ResponsableEntrega
        self.TelefonoResponsable = TelefonoResponsable
        self.FechaEstimada = FechaEstimada
        self.FechaEntrega = FechaEntrega
        self.EstadoEntrega = EstadoEntrega
        self.Observaciones = Observaciones

    def to_dict(self):
        return {
            'Id': self.Id,
            'IdCompra': self.IdCompra,
            'ResponsableEntrega': self.ResponsableEntrega,
            'TelefonoResponsable': self.TelefonoResponsable,
            'FechaEstimada': self.FechaEstimada,
            'FechaEntrega': self.FechaEntrega,
            'EstadoEntrega': self.EstadoEntrega,
            'Observaciones': self.Observaciones,
            'ESTADO': self.ESTADO,
            'RowVersion': self.RowVersion,
            'DISPONIBILIDAD': self.DISPONIBILIDAD,
            'FECHA_CREACION': self.FECHA_CREACION,
            'FECHA_MODIFICACION': self.FECHA_MODIFICACION,
            'USER_CREACION': self.USER_CREACION,
            'USER_MODIFICACION': self.USER_MODIFICACION
        }