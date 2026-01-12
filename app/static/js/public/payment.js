


document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector('.payment-close');
    const overlay = document.querySelector('.payment-overlay');

    if (closeBtn) closeBtn.addEventListener('click', closePaymentModal);
    if (overlay) overlay.addEventListener('click', closePaymentModal);

    const checkoutBtn = document.getElementById('btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.onclick = (e) => {
            e.preventDefault();
            if (window.toggleCart) window.toggleCart();
            openPaymentModal();
        };
    }
});

function openPaymentModal() {
    const modal = document.getElementById('payment-modal');
    const overlay = document.querySelector('.payment-overlay'); // Find overlay
    const body = document.body;
    if (modal) {
        modal.classList.add('open');
        if (overlay) overlay.classList.add('open'); // Explicitly open overlay
        body.classList.add('no-scroll');
        const form = document.getElementById('checkout-form');
        if (form) form.reset();
        toggleAddress(); // Reset address visibility
    }
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    const overlay = document.querySelector('.payment-overlay'); // Find overlay
    const body = document.body;
    if (modal) {
        modal.classList.remove('open');
        if (overlay) overlay.classList.remove('open'); // Explicitly close overlay
        const cartModal = document.getElementById('cart-modal');
        if (!cartModal || !cartModal.classList.contains('open')) {
            body.classList.remove('no-scroll');
        }
    }
}

window.toggleAddress = function () {
    const type = document.getElementById('tipo_entrega').value;
    const addrGroup = document.getElementById('address-group');
    const addrInput = document.getElementById('direccion');

    if (addrGroup && addrInput) {
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
}

window.processCheckout = async function (e) {
    e.preventDefault();
    const btn = document.querySelector('.btn-confirm-payment');
    const errorMsg = document.getElementById('payment-error-msg');

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="zmdi zmdi-spinner zmdi-hc-spin"></i> Procesando...';
    }
    if (errorMsg) errorMsg.style.display = 'none';

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
            window.location.href = '/new/productos'; // Redirect to new products page
        } else {
            if (errorMsg) {
                errorMsg.innerText = result.message || 'Error al procesar la compra.';
                errorMsg.style.display = 'block';
            }
            if (btn) {
                btn.disabled = false;
                btn.innerText = 'Confirmar Pedido';
            }
        }
    } catch (err) {
        console.error(err);
        if (errorMsg) {
            errorMsg.innerText = 'Error de conexión.';
            errorMsg.style.display = 'block';
        }
        if (btn) {
            btn.disabled = false;
            btn.innerText = 'Confirmar Pedido';
        }
    }
}