from .base import Entidad

class DetalleCompra(Entidad):
    def __init__(self, Id=None, IdCompra=None, IdProducto=None, Cantidad=None, PrecioUnitario=None, Subtotal=None, **kwargs):
        super().__init__(**kwargs)
        self.Id = Id
        self.IdCompra = IdCompra
        self.IdProducto = IdProducto
        self.Cantidad = Cantidad
        self.PrecioUnitario = PrecioUnitario
        self.Subtotal = Subtotal

    def to_dict(self):
        return {
            'Id': self.Id,
            'IdCompra': self.IdCompra,
            'IdProducto': self.IdProducto,
            'Cantidad': self.Cantidad,
            'PrecioUnitario': self.PrecioUnitario,
            'Subtotal': self.Subtotal,
            'ESTADO': self.ESTADO,
            'RowVersion': self.RowVersion,
            'DISPONIBILIDAD': self.DISPONIBILIDAD,
            'FECHA_CREACION': self.FECHA_CREACION,
            'FECHA_MODIFICACION': self.FECHA_MODIFICACION,
            'USER_CREACION': self.USER_CREACION,
            'USER_MODIFICACION': self.USER_MODIFICACION
        }
