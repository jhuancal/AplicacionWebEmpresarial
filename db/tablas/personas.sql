-- Tabla de Personas
CREATE TABLE personas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apeelido VARCHAR(100) NOT NULL,
    dni VARCHAR(9) NOT NULL,
    celular VARCHAR(9),
    direccion VARCHAR(255),
    estado BIT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_modificacion VARCHAR(255)
);



