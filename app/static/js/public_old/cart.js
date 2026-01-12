/* =========================================
   Cart & Checkout Logic
   ========================================= */

// Cart Logic
async function loadCart() {
    try {
        const res = await fetch('/api/carrito/items');
        if (!res.ok) {
            if (res.status === 401) window.location.href = '/login';
            return;
        }
        const items = await res.json();
        const container = document.getElementById('cart-items');
        if (!container) return; // Not on cart page

        container.innerHTML = '';
        let total = 0;

        const checkoutBtn = document.querySelector('.btn-checkout');

        if (items.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 2rem;">El carrito está vacío.</p>';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
        } else {
            if (checkoutBtn) checkoutBtn.style.display = 'inline-block';
        }

        items.forEach(item => {
            const precio = Number(item.PrecioVenta);
            const subtotal = precio * item.Cantidad;
            total += subtotal;
            container.innerHTML += `
                <div class="cart-item">
                    <img src="${item.UrlImagen}" alt="${item.ProductoNombre}" onerror="this.src='https://via.placeholder.com/80'">
                    <div class="item-details">
                        <h3>${item.ProductoNombre}</h3>
                        <p>Precio Unitario: S/ ${precio.toFixed(2)}</p>
                        <p><strong>Subtotal: S/ ${subtotal.toFixed(2)}</strong></p>
                    </div>
                    <div class="item-actions">
                        <button class="qty-btn" onclick="updateQty('${item.IdProducto}', ${item.Cantidad - 1})"><i class="fa fa-minus"></i></button>
                        <span style="font-weight:bold; min-width: 20px; text-align:center;">${item.Cantidad}</span>
                        <button class="qty-btn" onclick="updateQty('${item.IdProducto}', ${item.Cantidad + 1})"><i class="fa fa-plus"></i></button>
                        <button onclick="removeItem('${item.IdProducto}')" style="color:#dc3545; background:none; border:none; cursor:pointer; font-size:1.2rem; margin-left: 1rem;"><i class="fa fa-trash"></i></button>
                    </div>
                </div>
            `;
        });
        const totalEl = document.getElementById('cart-total');
        if (totalEl) totalEl.innerText = total.toFixed(2);
    } catch (e) {
        console.error(e);
        const container = document.getElementById('cart-items');
        if (container) container.innerHTML = '<p style="color:red; text-align:center;">Error al cargar el carrito.</p>';
    }
}

window.updateQty = async function (id, qty) {
    document.body.style.cursor = 'wait';
    try {
        await fetch('/api/carrito/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_producto: id, cantidad: qty })
        });
        await loadCart();
    } finally {
        document.body.style.cursor = 'default';
    }
}

window.removeItem = async function (id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    document.body.style.cursor = 'wait';
    try {
        await fetch('/api/carrito/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_producto: id })
        });
        await loadCart();
    } finally {
        document.body.style.cursor = 'default';
    }
}

// Checkout Logic
window.toggleAddress = function () {
    const type = document.getElementById('tipo_entrega').value;
    const addrGroup = document.getElementById('address-group');
    const addrInput = document.getElementById('direccion');
    if (type === 'Recojo') {
        addrGroup.style.display = 'none';
        addrInput.removeAttribute('required');
        addrInput.value = 'Tienda Principal';
    } else {
        addrGroup.style.display = 'block';
        addrInput.setAttribute('required', 'true');
        addrInput.value = '';
    }
}

window.processCheckout = async function (e) {
    e.preventDefault();
    const btn = document.querySelector('.btn-confirm');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Procesando...';

    const data = {
        tipo_entrega: document.getElementById('tipo_entrega').value,
        direccion: document.getElementById('direccion').value,
        metodo_pago: document.getElementById('metodo_pago').value
    };

    try {
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {
            alert('¡Compra realizada con éxito! Boleta: ' + result.boleta);
            window.location.href = '/compras'; // Redirect to history
        } else {
            const errorMsg = document.getElementById('error-msg');
            errorMsg.innerText = result.message || 'Error al procesar la compra.';
            errorMsg.style.display = 'block';
            btn.disabled = false;
            btn.innerText = 'Confirmar Pedido';
        }
    } catch (err) {
        console.error(err);
        const errorMsg = document.getElementById('error-msg');
        errorMsg.innerText = 'Error de conexión.';
        errorMsg.style.display = 'block';
        btn.disabled = false;
        btn.innerText = 'Confirmar Pedido';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-items')) {
        loadCart();
    }
});
