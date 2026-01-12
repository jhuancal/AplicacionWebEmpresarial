/* =========================================
   Orders History Logic
   ========================================= */

async function loadHistory() {
    try {
        const res = await fetch('/api/compras/history');
        if (!res.ok) {
            if (res.status === 401) window.location.href = '/login';
            return;
        }
        const orders = await res.json();
        const container = document.getElementById('orders-list');
        if (!container) return;

        container.innerHTML = '';

        if (orders.length === 0) {
            container.innerHTML = '<p>No has realizado compras.</p>';
            return;
        }

        orders.forEach(order => {
            let statusClass = 'status-pendiente';
            if (order.Estado === 'Pagado' || order.Estado === 'Entregado') statusClass = 'status-pagado';
            if (order.Estado === 'Enviado') statusClass = 'status-enviado';

            const deliveryStatus = order.EstadoEntrega ? `<div class="tracking-info"><i class="fa fa-truck"></i> Entrega: ${order.EstadoEntrega}</div>` : '';

            container.innerHTML += `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <strong>Boleta: ${order.NumeroBoleta}</strong><br>
                            <small>${new Date(order.FechaCompra).toLocaleString()}</small>
                        </div>
                        <div style="text-align:right;">
                            <span class="order-status ${statusClass}">${order.Estado}</span><br>
                            <strong>Total: S/ ${order.MontoTotal.toFixed(2)}</strong>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            ${deliveryStatus}
                        </div>
                        <button class="details-btn" onclick="toggleDetails('${order.Id}')">Ver Detalles</button>
                    </div>
                    <div id="details-${order.Id}" class="order-details">
                        Cargando detalles...
                    </div>
                </div>
            `;
        });
    } catch (e) {
        console.error(e);
        const container = document.getElementById('orders-list');
        if (container) container.innerHTML = '<p>Error al cargar el historial.</p>';
    }
}

window.toggleDetails = async function (id) {
    const div = document.getElementById(`details-${id}`);
    if (div.style.display === 'block') {
        div.style.display = 'none';
        return;
    }
    div.style.display = 'block';
    if (div.innerHTML.includes('Cargando')) {
        try {
            const res = await fetch(`/api/compras/details/${id}`);
            const details = await res.json();
            let html = '<h4>Productos:</h4>';
            details.forEach(d => {
                html += `
                    <div class="detail-item">
                        <span>${d.Cantidad} x Producto</span>
                        <span>S/ ${d.Subtotal.toFixed(2)}</span>
                    </div>
                `;
            });
            div.innerHTML = html;
        } catch (e) {
            div.innerHTML = 'Error cargando detalles.';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('orders-list')) {
        loadHistory();
    }
});
