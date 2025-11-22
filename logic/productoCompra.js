// Funcionalidad para el slider de imágenes
document.addEventListener('DOMContentLoaded', function () {
    const miniaturas = document.querySelectorAll('.miniatura');
    const imagenPrincipal = document.getElementById('imagen-principal');
    miniaturas.forEach(miniatura => {
        miniatura.addEventListener('click', function () {
            miniaturas.forEach(m => m.classList.remove('activa'));
            this.classList.add('activa');
        });
    });
    document.querySelectorAll(".contenedor-slider").forEach(contenedor => {
        const miniaturas = contenedor.querySelectorAll(".miniatura");
        const imagenPrincipal = contenedor.querySelector(".imagen-grande");

        miniaturas.forEach(miniatura => {
            miniatura.addEventListener("click", () => {
                imagenPrincipal.src = miniatura.src;
                imagenPrincipal.alt = miniatura.alt;
                miniaturas.forEach(m => m.classList.remove("activa"));
                miniatura.classList.add("activa");
            });
        });
    });

    // Funcionalidad para el selector de cantidad
    const botonDisminuir = document.getElementById('boton-disminuir');
    const botonAumentar = document.getElementById('boton-aumentar');
    const inputCantidad = document.getElementById('input-cantidad');

    botonDisminuir.addEventListener('click', function () {
        let valorActual = parseInt(inputCantidad.value);
        if (valorActual > 1) {
            inputCantidad.value = valorActual - 1;
        }
    });

    botonAumentar.addEventListener('click', function () {
        let valorActual = parseInt(inputCantidad.value);
        inputCantidad.value = valorActual + 1;
    });

    // Funcionalidad para mostrar/ocultar detalles del producto
    const botonDetalles = document.getElementById('boton-detalles');
    const detallesProducto = document.getElementById('detalles-producto');

    botonDetalles.addEventListener('click', function () {
        detallesProducto.classList.toggle('mostrar');
            if (detallesProducto.classList.contains('mostrar')) {
            this.textContent = 'Ocultar detalles';
        } else {
            this.textContent = 'Detalles del producto';
        }
    });

});