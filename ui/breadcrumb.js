class BreadCrumb extends HTMLElement{
  constructor(){
    super()
    this.attachShadow({mode: "open"})
  }
  render(){
    const padre=this.getAttribute("padre")
    const hijo=this.getAttribute("hijo")
    const padreHref=this.getAttribute("padreHref")

    this.shadowRoot.innerHTML=`
    <style>
      *{margin: 0; box-sizing: border-box;}
      :host{
        --rojo-principal: #b40500;
        --rojo-secundario: #9e1e1e;
        --oferta-text:#dd4e4e;
        --delivery-text: #3dd5ff;
        --negro-principal: #191919;
        background-color: #191919;
        color: #fff;
      }
      .card{
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        margin-top: 20px;
        .nav{
          display: flex;
          margin-bottom: 15px;
          a{
            padding: 5px 15px 5px 0;
            text-decoration: none;
            color: #fff;
            font-size: 12px;
            &:hover{
              text-decoration: underline;
            }
          }
          span{
            display: flex;
            svg{
              color: #fff;
              align-self: center;
              width: 9px;
              height: 9px;
            }
  
          }
          .item-current{
            font-size: 12px;
            padding: 5px 15px;
          }
        }

      
      }
    </style>
    <div class="card">
      <nav>
        <div class="nav">
          <a href="${padreHref}">${padre}</a>
          <span>
            <svg class="m-svg-icon--small m-rlt-reverse-x" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" data-darkreader-inline-fill="" data-darkreader-inline-stroke="">
              <path d="M17.525 36.465l-7.071 7.07c-4.686 4.686-4.686 12.284 0 16.971L205.947 256 10.454 451.494c-4.686 4.686-4.686 12.284 0 16.971l7.071 7.07c4.686 4.686 12.284 4.686 16.97 0l211.051-211.05c4.686-4.686 4.686-12.284 0-16.971L34.495 36.465c-4.686-4.687-12.284-4.687-16.97 0z"></path>
            </svg>
          </span>
          <a href="#" class="item-current">${hijo}</a>
        </div>
      </nav>
      <h1>${hijo}</h1>
    </div>
    `
  }
  connectedCallback(){
    this.render()
  }
}
customElements.define("breadcrumb-component",BreadCrumb)