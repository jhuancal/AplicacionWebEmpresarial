from datetime import datetime

class AdopcionSolicitud:
    def __init__(self, Id, IdCliente, IdMascota, FechaSolicitud, EstadoSolicitud='Nueva', Observacion=None,
                 ESTADO=1, DISPONIBILIDAD=1, FECHA_CREACION=None, FECHA_MODIFICACION=None,
                 USER_CREACION=None, USER_MODIFICACION=None):
        self.Id = Id
        self.IdCliente = IdCliente
        self.IdMascota = IdMascota
        self.FechaSolicitud = FechaSolicitud
        self.EstadoSolicitud = EstadoSolicitud
        self.Observacion = Observacion
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
            "IdMascota": self.IdMascota,
            "FechaSolicitud": self.FechaSolicitud,
            "EstadoSolicitud": self.EstadoSolicitud, # Renamed key as well for consistency
            "Observacion": self.Observacion,
            "ESTADO": self.ESTADO,
            "DISPONIBILIDAD": self.DISPONIBILIDAD,
            "FECHA_CREACION": self.FECHA_CREACION,
            "FECHA_MODIFICACION": self.FECHA_MODIFICACION,
            "USER_CREACION": self.USER_CREACION,
            "USER_MODIFICACION": self.USER_MODIFICACION
        }
