class ProductsComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async fetchProducts() {
    try {
      const response = await fetch('/api/products');
      const products = await response.json();
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async render() {
    const products = await this.fetchProducts();

    const productsHtml = products.map(product => `
      <product-card 
        id="${product.Id}"
        descuento="${product.Descuento}" 
        dia-llegada="${product.DiaLlegada}" 
        producto="${product.Nombre}" 
        precio-regular="${product.PrecioRegular}" 
        precio-venta="${product.PrecioVenta}" 
        img="${product.UrlImagen}">
      </product-card>
    `).join('');

    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="../static/css/products-component.css">
    <div class="productos">
      ${productsHtml}
    </div>`
  }

  connectedCallback() {
    this.render()
  }
}
customElements.define("products-component", ProductsComponent)