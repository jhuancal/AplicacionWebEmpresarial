from datetime import datetime

class Mascota:
    def __init__(self, Id, IdCliente, Nombre, Raza=None, FechaNacimiento=None, Tipo=None,
                 Historia=None, Origen=None, Cuidados=None, Observacion=None,
                 RowVersion=None, ESTADO=1, DISPONIBILIDAD=1,
                 FECHA_CREACION=None, FECHA_MODIFICACION=None,
                 USER_CREACION=None, USER_MODIFICACION=None):
        self.Id = Id
        self.IdCliente = IdCliente
        self.Nombre = Nombre
        self.Raza = Raza
        self.FechaNacimiento = FechaNacimiento
        self.Tipo = Tipo
        self.Historia = Historia
        self.Origen = Origen
        self.Cuidados = Cuidados
        self.Observacion = Observacion
        self.RowVersion = RowVersion
        self.ESTADO = ESTADO
        self.DISPONIBILIDAD = DISPONIBILIDAD
        self.FECHA_CREACION = FECHA_CREACION if FECHA_CREACION else int(datetime.now().timestamp() * 1000)
        self.FECHA_MODIFICACION = FECHA_MODIFICACION if FECHA_MODIFICACION else int(datetime.now().timestamp() * 1000)
        self.USER_CREACION = USER_CREACION
        self.USER_MODIFICACION = USER_MODIFICACION

    def to_dict(self):
        return {
            "Id": self.Id,
            "IdCliente": self.IdCliente,
            "Nombre": self.Nombre,
            "Raza": self.Raza,
            "FechaNacimiento": self.FechaNacimiento,
            "Tipo": self.Tipo,
            "Historia": self.Historia,
            "Origen": self.Origen,
            "Cuidados": self.Cuidados,
            "Observacion": self.Observacion,
            "ESTADO": self.ESTADO,
            "DISPONIBILIDAD": self.DISPONIBILIDAD,
            "FECHA_CREACION": self.FECHA_CREACION,
            "FECHA_MODIFICACION": self.FECHA_MODIFICACION,
            "USER_CREACION": self.USER_CREACION,
            "USER_MODIFICACION": self.USER_MODIFICACION
        }
