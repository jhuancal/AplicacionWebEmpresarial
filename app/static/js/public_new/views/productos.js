
document.addEventListener('DOMContentLoaded', () => {
    initProducts();
    setupFilters();
    setupEventDelegation();
});

let allProducts = [];

async function initProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    try {
        grid.innerHTML = '<div style="width:100%; text-align:center; padding:2rem;"><i class="zmdi zmdi-spinner zmdi-hc-spin zmdi-hc-3x"></i></div>';

        // Use the existing API endpoint that returns JSON (assuming it exists based on old code analysis)
        // If not, we might need to check routes. But let's try the standard one.
        const response = await fetch('/api/products');
        // Note: I am guessing the route based on standard practices or previous analysis. 
        // If /api/products was used in public_old JS, let's stick to valid endpoints.
        // Looking at public_old/views/products.js (Step 367), it used /api/products but that was client-side mock?
        // Wait, step 367 showed `export async function initProducts() { ... fetch('/api/products') ... }`
        // So `/api/products` likely exists. Let's use that.

        if (!response.ok) throw new Error('Failed to fetch products');

        allProducts = await response.json();
        console.log('Fetched products:', allProducts); // DEBUG LOG
        renderProducts(allProducts);

    } catch (error) {
        console.error('Error loading products:', error);
        grid.innerHTML = '<p class="has-text-centered is-size-5" style="grid-column: 1/-1; color: red;">Error al cargar productos. Intente nuevamente.</p>';
    }
}

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p class="has-text-centered is-size-5" style="grid-column: 1/-1;">No se encontraron productos.</p>';
        return;
    }

    products.forEach(product => {
        // Fallback for ID and Image
        const productId = product.Id || product.id || product.ID;
        if (!productId) {
            console.error('Product missing ID:', product);
            return;
        }

        let imageSrc = product.UrlImagen;
        if (!imageSrc || imageSrc.trim() === '') {
            imageSrc = '/static/img_new/not-found.jpg';
        }

        const card = document.createElement('div');
        card.className = 'product-card';

        const discountBadge = product.Descuento > 0
            ? `<span class="discount-badge">-${product.Descuento}%</span>`
            : '';

        const arrivalBadge = product.DiaLlegada
            ? `<span class="arrival-badge"><i class="zmdi zmdi-time"></i> ${product.DiaLlegada}</span>`
            : '';

        // onclick calls global addToCart from cart.js
        card.innerHTML = `
            <div class="product-image-container">
                ${discountBadge}
                <img src="${imageSrc}" alt="${product.Nombre}" class="product-img" onerror="this.src='/static/img_new/not-found.jpg'">
                ${arrivalBadge}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.Nombre}</h3>
                <p class="product-desc">${product.Descripcion || 'Sin descripción'}</p>
                <div class="product-meta">
                    <div class="prices">
                        ${product.PrecioRegular && product.PrecioRegular != product.PrecioVenta ? `<span class="price-original">S/ ${parseFloat(product.PrecioRegular).toFixed(2)}</span>` : ''}
                        <span class="price-final">S/ ${parseFloat(product.PrecioVenta).toFixed(2)}</span>
                    </div>
                    <button class="btn-add" title="Agregar al carrito">
                        <i class="zmdi zmdi-shopping-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);

        // Set data-id programmatically to ensure it sticks
        const btn = card.querySelector('.btn-add');
        if (btn) {
            btn.setAttribute('data-id', productId);
        }
    });
}


function setupEventDelegation() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    // Remove existing listener if any (not easily possible with anonymous functions but we run init once)
    // To be safe, we could use a named function or check a flag.
    if (grid.dataset.listenerAttached) return;

    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-add');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();

            const id = btn.getAttribute('data-id');
            if (id && id !== "undefined" && window.addToCart) {
                window.addToCart(id);
            } else {
                console.error('Invalid ID or addToCart missing. ID:', id);
            }
        }
    });
    grid.dataset.listenerAttached = "true";
}

function setupFilters() {
    const btnFilter = document.getElementById('btn-filter');
    const inputName = document.getElementById('filter-name');
    const inputMin = document.getElementById('filter-min');
    const inputMax = document.getElementById('filter-max');

    if (btnFilter) {
        btnFilter.addEventListener('click', () => {
            const nameTerm = inputName.value.toLowerCase();
            const minPrice = parseFloat(inputMin.value) || 0;
            const maxPrice = parseFloat(inputMax.value) || Infinity;

            const filtered = allProducts.filter(p => {
                const matchesName = (p.Nombre || '').toLowerCase().includes(nameTerm) || (p.Descripcion || '').toLowerCase().includes(nameTerm);
                const price = parseFloat(p.PrecioVenta);
                const matchesPrice = price >= minPrice && price <= maxPrice;

                return matchesName && matchesPrice;
            });

            renderProducts(filtered);
        });
    }
}
