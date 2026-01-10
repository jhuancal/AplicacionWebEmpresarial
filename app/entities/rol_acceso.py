from .base import Entidad

class RolAcceso(Entidad):
    def __init__(self, Id=None, IdRol=None, Codigo=None, Valor=None, Tipo=None, 
                 IdAccesoUno=None, IdAccesoDos=None, **kwargs):
        super().__init__(**kwargs)
        self.Id = Id
        self.IdRol = IdRol
        self.Codigo = Codigo
        self.Valor = Valor
        self.Tipo = Tipo
        self.IdAccesoUno = IdAccesoUno
        self.IdAccesoDos = IdAccesoDos

    def to_dict(self):
        return {
            'Id': self.Id,
            'IdRol': self.IdRol,
            'Codigo': self.Codigo,
            'Valor': self.Valor,
            'Tipo': self.Tipo,
            'IdAccesoUno': self.IdAccesoUno,
            'IdAccesoDos': self.IdAccesoDos,
            'ESTADO': self.ESTADO
        }
