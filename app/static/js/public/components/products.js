class ProductsComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.products = [];
    this.filteredProducts = [];
  }

  async fetchProducts() {
    try {
      const response = await fetch('/api/products');
      this.products = await response.json();
      this.filteredProducts = [...this.products];
    } catch (error) {
      console.error('Error fetching products:', error);
      this.products = [];
      this.filteredProducts = [];
    }
  }

  applyFilters() {
    // Get sorting value
    const sortSelect = this.shadowRoot.querySelector('#sort-select');
    const sortValue = sortSelect ? sortSelect.value : '';

    let temp = [...this.products];

    if (sortValue === 'price-asc') {
      temp.sort((a, b) => a.PrecioVenta - b.PrecioVenta);
    } else if (sortValue === 'price-desc') {
      temp.sort((a, b) => b.PrecioVenta - a.PrecioVenta);
    }

    this.filteredProducts = temp;
    this.renderProducts();
  }

  renderProducts() {
    const grid = this.shadowRoot.querySelector('.productos-grid');
    if (!grid) return;

    const productsHtml = this.filteredProducts.length ? this.filteredProducts.map(product => `
        <product-card 
          id="${product.Id}"
          descuento="${product.Descuento || 0}" 
          dia-llegada="${product.DiaLlegada || ''}" 
          producto="${product.Nombre}" 
          precio-regular="${product.PrecioRegular}" 
          precio-venta="${product.PrecioVenta}" 
          img="${product.UrlImagen}">
        </product-card>
      `).join('') : '<p>No se encontraron productos.</p>';

    grid.innerHTML = productsHtml;
  }

  async render() {
    await this.fetchProducts();

    this.shadowRoot.innerHTML = `
    <style>
      :host {
          display: block;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Poppins', sans-serif;
      }
      .container {
          display: flex;
          gap: 30px;
          padding: 20px 0;
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

            <!-- Add more filters here if data supports it -->
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
        <div class="productos-grid">
            <!-- Products rendered here -->
        </div>
    </div>`

    this.renderProducts();

    // Listeners
    this.shadowRoot.querySelector('#sort-select').addEventListener('change', () => this.applyFilters());
  }

  connectedCallback() {
    this.render()
  }
}
customElements.define("products-component", ProductsComponent)
