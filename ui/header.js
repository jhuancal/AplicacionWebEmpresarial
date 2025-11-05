class HeaderComponent extends HTMLElement{
  constructor(){
    super()
    this.attachShadow({mode: "open"})
  }
  render(){
    const nombre=this.getAttribute("nombre")
    const descripcion=this.getAttribute("descripcion")
    const placeHolder=this.getAttribute("place_holder")
    const pagPrincipal=this.getAttribute("pag_principal")

    this.shadowRoot.innerHTML=`
    <link rel="stylesheet" href="./styles/header-component.css">
    <header>
    <div class="bar">
      
      <a href="${pagPrincipal}" title="${nombre}">
        <img src="./images/logo_${nombre.toLowerCase()}.svg" alt="${nombre} ${descripcion}">
      </a>

      <form role="search" aria-label="Buscar en el sitio">
        <input name="search" id="search" required type="search" placeholder="${placeHolder}" aria-label="Buscar">
        <button type="submit" aria-label="Enviar búsqueda">
          <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-  outline icon-tabler-search">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" />
          </svg>
        </button>
      </form> 

      <nav>
        <div class="minicart">
          <a href="#" aria-label="Carrito">
            <img class="images" src="./images/minicart.png" alt="Carrito de compras">
          </a>
        </div>
        <div class="store">
          <a href="#" aria-label="Tiendas">
            <img class="images" src="./images/store.png" alt="Tienda">
          </a>
        </div>
        <div class="account">
          <img class="images" src="./images/user.png" alt="Usuario">
          <div>
            <a href="./login.html"><strong>Inicia sesión</strong></a>
            <a href="./register.html">Regístrate</a>
          </div>
        </div>
      </nav>

    </div>

    <nav class="nav">
      <ul>
        <li><a href="./collections.html">Perros</a></li>
        <li><a href="#gato">Gatos</a></li>
        <li><a href="#otras-mascotas">Otras mascotas</a></li>
        <li><a href="#marcas">Marcas</a></li>
        <li><a href="#">Peluquería canina</a></li>
        <li><a href="#seguros">Seguros</a></li>
      </ul>
    </nav>
  </header>`
  }
  connectedCallback(){
    this.render()
  }
}
customElements.define("header-component",HeaderComponent)