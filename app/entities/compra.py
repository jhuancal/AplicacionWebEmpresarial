from .base import Entidad

class Compra(Entidad):
    def __init__(self, Id=None, IdCliente=None, FechaCompra=None, MontoTotal=None, MetodoPago=None, DireccionEntrega=None, TipoEntrega=None, Estado=None, NumeroBoleta=None, **kwargs):
        super().__init__(**kwargs)
        self.Id = Id
        self.IdCliente = IdCliente
        self.FechaCompra = FechaCompra
        self.MontoTotal = MontoTotal
        self.MetodoPago = MetodoPago
        self.DireccionEntrega = DireccionEntrega
        self.TipoEntrega = TipoEntrega
        self.Estado = Estado
        self.NumeroBoleta = NumeroBoleta

    def to_dict(self):
        return {
            'Id': self.Id,
            'IdCliente': self.IdCliente,
            'FechaCompra': self.FechaCompra,
            'MontoTotal': self.MontoTotal,
            'MetodoPago': self.MetodoPago,
            'DireccionEntrega': self.DireccionEntrega,
            'TipoEntrega': self.TipoEntrega,
            'Estado': self.Estado,
            'NumeroBoleta': self.NumeroBoleta,
            'ESTADO': self.ESTADO,
            'RowVersion': self.RowVersion,
            'DISPONIBILIDAD': self.DISPONIBILIDAD,
            'FECHA_CREACION': self.FECHA_CREACION,
            'FECHA_MODIFICACION': self.FECHA_MODIFICACION,
            'USER_CREACION': self.USER_CREACION,
            'USER_MODIFICACION': self.USER_MODIFICACION
        }

