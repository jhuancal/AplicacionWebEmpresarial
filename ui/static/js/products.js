class ProductsComponent extends HTMLElement{
  constructor(){
    super()
    this.attachShadow({mode: "open"})
  }
  render(){
    this.shadowRoot.innerHTML=`
    <link rel="stylesheet" href="../static/css/products-component.css">
    <div class="productos">
      <product-card descuento="80" dia-llegada="Martes" producto="Silla" precio-regular="389" precio-venta="439" img="https://quepatas.com/cdn/shop/files/MALSEG-1_847d98d0-fd53-4edc-a847-5d5e72b0a402.jpg?v=1747856665&width=1100"></product-card>
      <product-card descuento="80" dia-llegada="Martes" producto="Silla" precio-regular="389" precio-venta="439" img="https://quepatas.com/cdn/shop/files/MALSEG-1_847d98d0-fd53-4edc-a847-5d5e72b0a402.jpg?v=1747856665&width=1100"></product-card>
      <product-card descuento="80" dia-llegada="Martes" producto="Silla" precio-regular="389" precio-venta="439" img="https://quepatas.com/cdn/shop/files/MALSEG-1_847d98d0-fd53-4edc-a847-5d5e72b0a402.jpg?v=1747856665&width=1100"></product-card>
      <product-card descuento="80" dia-llegada="Martes" producto="Silla" precio-regular="389" precio-venta="439" img="https://quepatas.com/cdn/shop/files/MALSEG-1_847d98d0-fd53-4edc-a847-5d5e72b0a402.jpg?v=1747856665&width=1100"></product-card>
      <product-card descuento="80" dia-llegada="Martes" producto="Silla" precio-regular="389" precio-venta="439" img="https://quepatas.com/cdn/shop/files/MALSEG-1_847d98d0-fd53-4edc-a847-5d5e72b0a402.jpg?v=1747856665&width=1100"></product-card>
      <product-card descuento="80" dia-llegada="Martes" producto="Silla" precio-regular="389" precio-venta="439" img="https://quepatas.com/cdn/shop/files/MALSEG-1_847d98d0-fd53-4edc-a847-5d5e72b0a402.jpg?v=1747856665&width=1100"></product-card>
    </div>`
  }
  connectedCallback(){
    this.render()
  }
}
customElements.define("products-component", ProductsComponent)