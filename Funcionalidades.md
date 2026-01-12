# Funcionalidades Públicas Actuales (Funcionalidades.md)

Este documento detalla las funcionalidades disponibles en las páginas públicas del sistema actual ("old").

## Paginas y Rutas

### Inicio / Landing Page (`/`, `/productos`, `/publicaciones`)
- **Visualización de Productos**: Muestra lista de productos obtenidos vía API (`/api/products`).
- **Visualización de Publicaciones (Feed)**: Muestra publicaciones (imágenes/videos) de usuarios/admin (`/api/publicaciones/feed`).
- **Navegación**: Menú principal con enlaces a Login, Registro, Carrito, Adopción.
- **Carrusel**: Visualización destacada en la cabecera.

### Autenticación
- **Registro (`/register`)**:
  - Formulario de registro para nuevos clientes.
  - Validación de email y teléfono.
  - API: `/api/register`, `/api/auth/initiate-register`.
- **Inicio de Sesión (`/login`)**:
  - Modal o página de login (redirige a `/` si ya está logueado).
  - API: `/api/login`.
- **Cierre de Sesión (`/logout`)**: Finaliza la sesión actual.

### Adopción (`/adopcion`)
- **Listado de Mascotas**: Muestra mascotas disponibles para adopción.
- **Mis Mascotas**: Visualización de mascotas del usuario logueado (si aplica).
- API: `/api/public/mascotas`, `/api/mis-mascotas`.

### Carrito de Compras (`/carrito`)
- **Gestión de Items**:
  - Ver productos añadidos.
  - Modificar cantidades.
  - Eliminar productos.
- **Resumen**: Cálculo de subtotal y total.
- **Acción de Compra**: Botón para proceder al checkout.
- API: `/api/carrito/items`, `/api/carrito/add`, `/api/carrito/update`, `/api/carrito/remove`.

### Proceso de Compra (`/checkout`)
- **Formulario de Envío**: Selección de dirección y método de entrega (Delivery/Recojo).
- **Pago**: Selección de método de pago.
- **Confirmación**: Generación de boleta y registro de compra.
- API: `/api/checkout`.

### Historial de Compras (`/compras`)
- **Listado**: Ver historial de compras realizadas por el usuario.
- **Detalle**: Ver detalles de una compra específica.
- API: `/api/compras/history`, `/api/compras/details/<id>`.

## Notas Técnicas
- **Autenticación**: Basada en sesión de Flask (`session['user_data']`).
- **Frontend**: HTML con Bootstrap (o estilos personalizados en `styles.css`) y JavaScript vainilla interactuando con APIs REST.
