
/* Cart Logic for Public New */

const CART_API = {
    items: '/api/carrito/items',
    add: '/api/carrito/add',
    update: '/api/carrito/update',
    remove: '/api/carrito/remove'
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Cart Trigger if exists
    const cartTrigger = document.getElementById('cart-trigger');
    if (cartTrigger) {
        cartTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }

    // Close buttons
    const closeBtn = document.querySelector('.cart-close');
    const overlay = document.querySelector('.cart-overlay');

    if (closeBtn) closeBtn.addEventListener('click', toggleCart);
    if (overlay) overlay.addEventListener('click', toggleCart);

    // Initial Load - Only if user is logged in (cart trigger exists)
    if (cartTrigger) {
        loadCart();
    }
});

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    const body = document.body;

    if (modal) {
        modal.classList.toggle('open');
        body.classList.toggle('no-scroll'); // Prevent body scrolling
    }
}
window.toggleCart = toggleCart;

async function loadCart() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-amount');
    const countBadge = document.getElementById('cart-count-badge');

    if (!container) return;

    try {
        // Show Spinner
        container.innerHTML = '<div class="cart-spinner"><i class="zmdi zmdi-spinner zmdi-hc-spin"></i> Cargando...</div>';

        const res = await fetch(CART_API.items);
        if (res.status === 401) return; // Not logged in

        const items = await res.json();
        renderCart(items);

    } catch (error) {
        console.error('Error loading cart:', error);
        container.innerHTML = '<p class="error-msg">Error al cargar el carrito. Intente nuevamente.</p>';
    }
}

function renderCart(items) {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-amount');
    const countBadge = document.getElementById('cart-count-badge');
    const checkoutBtn = document.getElementById('btn-checkout');

    if (!container) return;

    container.innerHTML = '';
    let total = 0;
    let count = 0;

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="zmdi zmdi-shopping-cart-plus"></i>
                <p>Tu carrito está vacío</p>
                <button class="btn-shop" onclick="toggleCart()">Seguir Comprando</button>
            </div>
        `;
        if (checkoutBtn) checkoutBtn.style.display = 'none';
    } else {
        if (checkoutBtn) checkoutBtn.style.display = 'block';

        items.forEach(item => {
            const precio = Number(item.PrecioVenta);
            const subtotal = precio * item.Cantidad;
            total += subtotal;
            count += item.Cantidad;

            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.UrlImagen}" alt="${item.ProductoNombre}" onerror="this.src='/static/img_new/placeholder.jpg'">
                </div>
                <div class="cart-item-info">
                    <h4>${item.ProductoNombre}</h4>
                    <p class="cart-item-price">S/ ${precio.toFixed(2)}</p>
                    <div class="cart-item-controls">
                        <button onclick="updateQty('${item.IdProducto}', ${item.Cantidad - 1})"><i class="zmdi zmdi-minus"></i></button>
                        <span>${item.Cantidad}</span>
                        <button onclick="updateQty('${item.IdProducto}', ${item.Cantidad + 1})"><i class="zmdi zmdi-plus"></i></button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeItem('${item.IdProducto}')">
                    <i class="zmdi zmdi-delete"></i>
                </button>
            `;
            container.appendChild(itemEl);
        });
    }

    if (totalEl) totalEl.innerText = total.toFixed(2);
    if (countBadge) {
        countBadge.innerText = count;
        countBadge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Global functions for inline onclicks
window.updateQty = async function (id, qty) {
    if (qty < 1) return; // Minimum 1, use remove for 0? Or just block.

    // Optimistic UI update could go here, but let's stick to safe API first
    try {
        await fetch(CART_API.update, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_producto: id, cantidad: qty })
        });
        loadCart(); // Reload to sync
    } catch (e) {
        console.error(e);
    }
};

window.removeItem = async function (id) {
    if (!confirm('¿Eliminar producto del carrito?')) return;

    try {
        await fetch(CART_API.remove, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_producto: id })
        });
        loadCart();
    } catch (e) {
        console.error(e);
    }
};

window.addToCart = async function (id) {
    // Check if user is logged in (simple check via navbar presence or global var)
    // We can check if cart-trigger exists, if not, show login modal
    const cartTrigger = document.getElementById('cart-trigger');
    if (!cartTrigger) {
        // Trigger login modal
        const loginTrigger = document.getElementById('login-trigger');
        if (loginTrigger) loginTrigger.click();
        else alert('Por favor inicia sesión para comprar');
        return;
    }

    // Show loading state on button if possible (needs passed element)
    // For now, simpler:

    try {
        const res = await fetch(CART_API.add, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_producto: id, cantidad: 1 })
        });
        const data = await res.json();

        if (data.success) {
            loadCart(); // Refresh cart data
            const modal = document.getElementById('cart-modal');
            if (modal && !modal.classList.contains('open')) {
                toggleCart(); // Auto open cart on add
            }
        } else {
            alert('Error al agregar producto');
        }
    } catch (e) {
        console.error(e);
    }
};
