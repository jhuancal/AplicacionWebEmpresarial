from .base import Entidad

class Carrito(Entidad):
    def __init__(self, Id=None, IdCliente=None, IdProducto=None, Cantidad=None, FechaAgregado=None, **kwargs):
        super().__init__(**kwargs)
        self.Id = Id
        self.IdCliente = IdCliente
        self.IdProducto = IdProducto
        self.Cantidad = Cantidad
        self.FechaAgregado = FechaAgregado

    def to_dict(self):
        return {
            'Id': self.Id,
            'IdCliente': self.IdCliente,
            'IdProducto': self.IdProducto,
            'Cantidad': self.Cantidad,
            'FechaAgregado': self.FechaAgregado,
            'ESTADO': self.ESTADO,
            'RowVersion': self.RowVersion,
            'DISPONIBILIDAD': self.DISPONIBILIDAD,
            'FECHA_CREACION': self.FECHA_CREACION,
            'FECHA_MODIFICACION': self.FECHA_MODIFICACION,
            'USER_CREACION': self.USER_CREACION,
            'USER_MODIFICACION': self.USER_MODIFICACION
        }
