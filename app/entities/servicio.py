from .base import Entidad

class Servicio(Entidad):
    def __init__(self, Id=None, Nombre=None, TipoMascota=None, Categoria=None, DuracionMinutos=None, Costo=None, Descripcion=None, Requisitos=None, Horario=None, PersonalAsignado=None, **kwargs):
        super().__init__(**kwargs)
        self.Id = Id
        self.Nombre = Nombre
        self.TipoMascota = TipoMascota
        self.Categoria = Categoria
        self.DuracionMinutos = DuracionMinutos
        self.Costo = Costo
        self.Descripcion = Descripcion
        self.Requisitos = Requisitos
        self.Horario = Horario
        self.PersonalAsignado = PersonalAsignado

    def to_dict(self):
        return {
            'Id': self.Id,
            'Nombre': self.Nombre,
            'TipoMascota': self.TipoMascota,
            'Categoria': self.Categoria,
            'DuracionMinutos': self.DuracionMinutos,
            'Costo': float(self.Costo) if self.Costo else 0.0,
            'Descripcion': self.Descripcion,
            'Requisitos': self.Requisitos,
            'Horario': self.Horario,
            'PersonalAsignado': self.PersonalAsignado,
            'ESTADO': self.ESTADO,
            'RowVersion': self.RowVersion,
            'DISPONIBILIDAD': self.DISPONIBILIDAD,
            'FECHA_CREACION': self.FECHA_CREACION,
            'FECHA_MODIFICACION': self.FECHA_MODIFICACION,
            'USER_CREACION': self.USER_CREACION,
            'USER_MODIFICACION': self.USER_MODIFICACION
        }
