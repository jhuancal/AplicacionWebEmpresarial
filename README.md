# AplicacionWebEmpresarial: Tienda de Productos para Mascotas

Este repositorio contiene el código fuente del Trabajo Final Grupal del curso de Desarrollo Web. El proyecto consiste en una tienda en línea dinámica dedicada a la venta de productos para mascotas.

## 🔗 URL del Proyecto Desplegado

**[https://aplicacionwebempresarial-production.up.railway.app/](https://aplicacionwebempresarial-production.up.railway.app/)**

## 📝 Descripción

La aplicación es una plataforma de comercio electrónico diseñada para facilitar la compra de artículos para mascotas. Permite a los usuarios navegar por un catálogo de productos, ver detalles, y gestiona roles de usuario (administrador y clientes). El sistema cuenta con autenticación segura, manejo de sesiones y persistencia de datos relacional. Se ha priorizado una arquitectura limpia y una interfaz de usuario responsiva y amigable.

## 🛠 Lenguajes y Tecnologías

El proyecto ha sido desarrollado utilizando las siguientes tecnologías:

*   **HTML**: Estructura semántica de las páginas.
*   **CSS**: Estilos personalizados y diseño responsivo.
*   **JavaScript (JS)**: Interactividad del lado del cliente y consumo de APIs.
*   **Python (Flask)**: Lógica del backend, manejo de rutas y APIs REST.
*   **SQL (MySQL)**: Gestión y persistencia de base de datos.

## 👥 Integrantes del Equipo

| Role | Integrante | Calificación del Líder |
| :--- | :--- | :--- |
| **Líder** | **Jhoans Anthony Huanca Lupaca** | 100% |
| Colaborador | Luis Alberto García Daza | 100% |
| Colaborador | Mamani Gutierrez Jonahtan Joaquin | 100% |

*(Calificación basada en el cumplimiento de tareas y participación activa en el desarrollo)*

## 🏗 Arquitectura y Despliegue en Railway

### Evolución de la Arquitectura: De Docker Compose a Servicios Gestionados

Inicialmente, el entorno de desarrollo utilizaba `docker-compose` para orquestar dos contenedores: uno para la aplicación Flask y otro para la base de datos MySQL local.

Para el despliegue en producción utilizando **Railway**, migramos a una arquitectura más robusta y nativa de la nube:

1.  **Backend (App)**: Se configuró un contenedor Docker único para la aplicación Flask. En lugar de depender de `docker-compose` (que une los servicios en una sola máquina virtual), definimos un `Dockerfile` optimizado que instala las dependencias y prepara el entorno.
2.  **Base de Datos (Managed MySQL)**: En lugar de un contenedor efímero, utilizamos un **Servicio Gestionado de MySQL** provisto por Railway.

**¿Por qué este cambio?**
*   **Persistencia y Seguridad**: Los servicios gestionados garantizan que los datos no se pierdan si el contenedor de la aplicación se reinicia.
*   **Escalabilidad**: Permite escalar el backend y la base de datos de forma independiente.
*   **Configuración**: La aplicación se conecta dinámicamente a la base de datos mediante variables de entorno (`MYSQLHOST`, `MYSQLUSER`, etc.), lo que hace que el sistema sea flexible y seguro, adaptándose automáticamente al entorno de producción sin cambiar el código.

---
© 2025 Universidad Nacional de San Agustín - Ingeniería de Sistemas
