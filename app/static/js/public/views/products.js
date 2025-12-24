
export const productsView = `
<style>
    .container {
        display: flex;
        gap: 30px;
        padding: 20px 0;
        font-family: 'Poppins', sans-serif;
    }
    .sidebar {
        width: 250px;
        flex-shrink: 0;
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        height: fit-content;
    }
    .sidebar h3 {
        margin-top: 0;
        color: #333;
        border-bottom: 2px solid #f4f4f4;
        padding-bottom: 10px;
    }
    .filter-group {
        margin-bottom: 20px;
    }
    .filter-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #555;
    }
    .filter-group select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    .productos-grid {
        flex-grow: 1;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 20px;
    }
    
    
    .product-card {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
        transition: transform 0.2s, box-shadow 0.2s;
        display: flex;
        flex-direction: column;
    }
    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .product-image {
        position: relative;
        height: 200px;
        overflow: hidden;
    }
    .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .discount-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background: #e74c3c;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8em;
        font-weight: bold;
    }
    .product-info {
        padding: 15px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
    .product-arrival {
        color: #27ae60;
        font-size: 0.8em;
        font-weight: 500;
        margin-bottom: 5px;
    }
    .product-name {
        margin: 0 0 10px 0;
        font-size: 1em;
        font-weight: 600;
        color: #333;
        line-height: 1.4;
    }
    .product-prices {
        margin-top: auto;
    }
    .price-regular {
        text-decoration: line-through;
        color: #999;
        font-size: 0.9em;
        margin-right: 5px;
    }
    .price-sale {
        color: #e74c3c;
        font-weight: bold;
        font-size: 1.1em;
    }
    .add-btn {
        margin-top: 10px;
        width: 100%;
        padding: 8px;
        background: #333;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
    }
    .add-btn:hover {
        background: #555;
    }
    
    @media (max-width: 768px) {
        .container {
            flex-direction: column;
        }
        .sidebar {
            width: 100%;
        }
    }
</style>

<div class="container">
    <!-- Sidebar Filter -->
    <div class="sidebar">
        <h3>Filtros</h3>
        
        <div class="filter-group">
            <label for="sort-select">Ordenamiento</label>
            <select id="sort-select">
                <option value="default">Relevancia</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
        </div>

        <div class="filter-group">
            <label>Categoría</label>
            <div style="padding: 5px 0;">
                <input type="checkbox" disabled> <span style="color: #aaa">Comida (Próximamente)</span>
            </div>
             <div style="padding: 5px 0;">
                <input type="checkbox" disabled> <span style="color: #aaa">Juguetes (Próximamente)</span>
            </div>
        </div>
    </div>

    <!-- Grid -->
    <div class="productos-grid" id="productos-grid">
        <p>Cargando productos...</p>
    </div>
</div>
`;

let allProducts = [];

export async function initProducts() {
    const grid = document.getElementById('productos-grid');
    const sortSelect = document.getElementById('sort-select');

    if (!grid) return;

    try {
        const response = await fetch('/api/products');
        allProducts = await response.json();
        renderGrid(allProducts, grid);
    } catch (error) {
        console.error('Error fetching products:', error);
        grid.innerHTML = '<p>Error al cargar productos.</p>';
        allProducts = [];
    }
    if (sortSelect) {
        sortSelect.addEventListener('change', () => applyFilters(grid));
    }
}

function applyFilters(grid) {
    const sortSelect = document.getElementById('sort-select');
    const sortValue = sortSelect ? sortSelect.value : '';

    let temp = [...allProducts];

    if (sortValue === 'price-asc') {
        temp.sort((a, b) => a.PrecioVenta - b.PrecioVenta);
    } else if (sortValue === 'price-desc') {
        temp.sort((a, b) => b.PrecioVenta - a.PrecioVenta);
    }

    renderGrid(temp, grid);
}

function renderGrid(products, grid) {
    if (!products.length) {
        grid.innerHTML = '<p>No se encontraron productos.</p>';
        return;
    }

    const html = products.map(p => `
        <div class="product-card">
            <div class="product-image">
                ${p.Descuento > 0 ? `<div class="discount-badge">-${p.Descuento}%</div>` : ''}
                <!-- Fallback to placeholder if img fails -->
                <img src="${p.UrlImagen}" alt="${p.Nombre}" onerror="this.onerror=null; this.src='https://placehold.co/400'">
            </div>
            <div class="product-info">
                ${p.DiaLlegada ? `<div class="product-arrival">${p.DiaLlegada}</div>` : ''}
                <h3 class="product-name">${p.Nombre}</h3>
                <div class="product-prices">
                     ${p.Descuento > 0 ? `<span class="price-regular">S/ ${p.PrecioRegular}</span>` : ''}
                    <span class="price-sale">S/ ${p.PrecioVenta}</span>
                </div>
                <button class="add-btn">Agregar</button>
            </div>
        </div>
    `).join('');

    grid.innerHTML = html;
}
