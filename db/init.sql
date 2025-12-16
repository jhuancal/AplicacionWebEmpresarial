CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_regular DECIMAL(10, 2),
    price_sale DECIMAL(10, 2),
    discount INT,
    arrival_day VARCHAR(50),
    image_url VARCHAR(255)
);

INSERT INTO products (name, description, price_regular, price_sale, discount, arrival_day, image_url) VALUES
('Silla', 'Silla cómoda', 389.00, 439.00, 80, 'Martes', 'https://quepatas.com/cdn/shop/files/MALSEG-1_847d98d0-fd53-4edc-a847-5d5e72b0a402.jpg?v=1747856665&width=1100'),
('Mesa', 'Mesa de madera', 150.00, 120.00, 20, 'Lunes', 'https://quepatas.com/cdn/shop/files/MALSEG-1_847d98d0-fd53-4edc-a847-5d5e72b0a402.jpg?v=1747856665&width=1100'),
('Sofá', 'Sofá de cuero', 500.00, 450.00, 10, 'Viernes', 'https://quepatas.com/cdn/shop/files/MALSEG-1_847d98d0-fd53-4edc-a847-5d5e72b0a402.jpg?v=1747856665&width=1100');
