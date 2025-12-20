class FilterPanel extends HTMLElement{
  constructor(){
    super()
    this.attachShadow({mode: "open"})
  }
  render(){
    this.shadowRoot.innerHTML=`
    <link rel="stylesheet" href="../static/css/filter-panel-component.css">
    <div class="card">
      <h3>Filtros</h3>
      <div class="toolbar">
        <span>Ordenamiento</span>
        <div class="options">
          <div class="option">Más vendidos</div>
          <div class="option">Precio, menor a mayor</div>
          <div class="option">Precio, mayor a menor</div>
        </div>
      </div>
      <form action="">
        <div class="filter">
          <span>Uso</span>
          <ul>
            <li>
              <div>
                <input type="checkbox">
              </div>
              <span>Exterior</span>
            </li>
          </ul>
        </div>
        <div class="filter">
          <span>Tipo de producto</span>
          <ul>
            <li>
              <div>
                <input type="checkbox">
              </div>
              <span>Individual</span>
            </li>
          </ul>
        </div>
      </form>
    </div>
    `
  }
  connectedCallback(){
    this.render()
  }
}
customElements.define("filter-component",FilterPanel)