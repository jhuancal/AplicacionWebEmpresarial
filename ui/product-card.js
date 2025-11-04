class ProductCard extends HTMLElement{
  constructor(){
    super()
    this.attachShadow({mode: "open"})
  }
  render(){
    const descuento=this.getAttribute("descuento")
    const diaLlegada=this.getAttribute("dia-llegada")
    const producto=this.getAttribute("producto")
    const precioRegular=parseInt(this.getAttribute("precio-regular")).toFixed(2)
    const precioVenta=parseInt(this.getAttribute("precio-venta")).toFixed(2)
    const img=this.getAttribute("img")

    this.shadowRoot.innerHTML=`
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./styles/product-card-component.css">
    <div class="card">
      <div class="media">
        <a href="#">
          <img src="${img}" width="200" height="200" alt="">
        </a>
        <div class="tags">
          <span>-${descuento}%</span>
        </div>
      </div>
      
      <div class="content">
        <div class="tags">
          <p>Oferta</p>
          <span>Recibelo ${diaLlegada.toLowerCase()}</span>
        </div>
        <div class="info">
          <h3>
            <a href="#">${producto}</a>
          </h3>
          <div class="price">
            <div class="regular">
              <span class="visually-hidden">Precio regular</span>
              <s>S/ ${precioRegular}</s>
            </div>
            <div class="sale">
              <span class="visually-hidden">Precio de venta</span>
              <span>S/ ${precioVenta}</span>
            </div>
          </div>
        </div>
      </div>
    </div>` 
  }
  connectedCallback(){
    this.render()
  }
}
customElements.define("product-card",ProductCard)