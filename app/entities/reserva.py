from .base import Entidad

class Reserva(Entidad):
    def __init__(self, Id=None, IdCliente=None, IdMascota=None, IdServicio=None, FechaHora=None, EstadoReserva=None, Observaciones=None, **kwargs):
        super().__init__(**kwargs)
        self.Id = Id
        self.IdCliente = IdCliente
        self.IdMascota = IdMascota
        self.IdServicio = IdServicio
        self.FechaHora = FechaHora
        self.EstadoReserva = EstadoReserva
        self.Observaciones = Observaciones

    def to_dict(self):
        return {
            'Id': self.Id,
            'IdCliente': self.IdCliente,
            'IdMascota': self.IdMascota,
            'IdServicio': self.IdServicio,
            'FechaHora': self.FechaHora,
            'EstadoReserva': self.EstadoReserva,
            'Observaciones': self.Observaciones,
            'ESTADO': self.ESTADO,
            'RowVersion': self.RowVersion,
            'DISPONIBILIDAD': self.DISPONIBILIDAD,
            'FECHA_CREACION': self.FECHA_CREACION,
            'FECHA_MODIFICACION': self.FECHA_MODIFICACION,
            'USER_CREACION': self.USER_CREACION,
            'USER_MODIFICACION': self.USER_MODIFICACION
        }
