DROP TABLE IF EXISTS products;

CREATE TABLE IF NOT EXISTS Adm_Producto (
    Id CHAR(36) NOT NULL PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Descripcion TEXT,
    PrecioRegular DECIMAL(10, 2),
    PrecioVenta DECIMAL(10, 2),
    Descuento INT,
    DiaLlegada VARCHAR(50),
    UrlImagen VARCHAR(255),
    RowVersion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ESTADO BIT NOT NULL,
    DISPONIBILIDAD BIT NOT NULL,
    FECHA_CREACION BIGINT NOT NULL,
    FECHA_MODIFICACION BIGINT NOT NULL,
    USER_CREACION TEXT,
    USER_MODIFICACION TEXT
);

INSERT INTO Adm_Producto (Id, Nombre, Descripcion, PrecioRegular, PrecioVenta, Descuento, DiaLlegada, UrlImagen, ESTADO, DISPONIBILIDAD, FECHA_CREACION, FECHA_MODIFICACION, USER_CREACION, USER_MODIFICACION) VALUES
(UUID(), 'Silla', 'Silla cómoda', 389.00, 439.00, 80, 'Martes', 'https://quepatas.com/cdn/shop/files/MALSEG-1_847d98d0-fd53-4edc-a847-5d5e72b0a402.jpg?v=1747856665&width=1100', 1, 1, 1725375954790, 1725375954790, 'SYS', 'SYS'),
(UUID(), 'Mesa', 'Mesa de madera', 150.00, 120.00, 20, 'Lunes', 'https://quepatas.com/cdn/shop/files/MALSEG-1_847d98d0-fd53-4edc-a847-5d5e72b0a402.jpg?v=1747856665&width=1100', 1, 1, 1725375954790, 1725375954790, 'SYS', 'SYS'),
(UUID(), 'Sofá', 'Sofá de cuero', 500.00, 450.00, 10, 'Viernes', 'https://quepatas.com/cdn/shop/files/MALSEG-1_847d98d0-fd53-4edc-a847-5d5e72b0a402.jpg?v=1747856665&width=1100', 1, 1, 1725375954790, 1725375954790, 'SYS', 'SYS');
