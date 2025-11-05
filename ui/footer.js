class FooterComponent extends HTMLElement{
  constructor(){
    super()
    this.attachShadow({mode: "open"})
  }
  render(){

    this.shadowRoot.innerHTML=`
    <link rel="stylesheet" href="./styles/footer-component.css">
    <div class="footer">
      <div class="container">
        <div class="container-rows">
          <div class="container-item">
            <span>Mi cuenta</span>
            <ul>
              <li><a href="#">Entrar en mi cuenta</a></li>
              <li><a href="#">Mis pedidos</a></li>
            </ul>
          </div>
          <div class="container-item">
            <span>Guía de Compra</span>
            <ul>
              <li><a href="#">Información de Envío</a></li>
              <li><a href="#">Preguntas Frecuentes</a></li>
              <li><a href="#">Términos y Condiciones de uso</a></li>
              <li><a href="#">Super Puntos</a></li>
              <li><a href="#">Legales Campañas</a></li>
              <li><a href="#">Ganadores sorteos</a></li>
            </ul>
            <a href="https://www.superpet.pe/libro-de-reclamaciones" target="_blank">
              <img src="https://www.superpet.pe/on/demandware.static/-/Library-Sites-SuperPetSharedLibrary/default/dw4ba9aca5/SuperPet/Homepage/footer/libro-rec.png" height="80px" width="auto">
            </a>
          </div>
          <div class="container-item">
            <span>Contacto</span>
            <ul>
              <li><span>Mail: <a href="mailto:pedidos@legacy.superpet.pe">pedidos@superpet.pe</a></span></li>
              <li><span>Teléfono: <a href="tel:01 641 64 64">01 641 64 64</a></span></li>
              <li><span>Whatsapp: <a href="https://api.whatsapp.com/send?phone=51993703333&amp;text=">+51 993 703 333</a></span></li>
              <li><span>Servicio de atención: </span></li>
              <li><span>Lunes a sabados. 8am - 9pm </span></li>
              <li><span>Domingo 8am - 8pm</span></li>
              <li><span><a href="https://superpet.eticaenlinea.com/" target="blank">Canal de Denuncias</a></span></li>
            </ul>
          </div>
          <div class="container-item">
            <span>SuperPet</span>
            <ul>
              <li><a href="https://www.superpet.pe/quienes-somos-superpet.html" title="Quienes somos" target="_blank">Acerca de SuperPet</a></li>
              <li><a href="https://pe.computrabajo.com/superpet" target="_blank" title="Trabaja con nosotros">Trabaja con nosotros</a></li>
              <li><a href="https://www.superpet.pe/politica-de-privacidad-superpet.html" target="_blank">Política de Privacidad</a></li>
              <li><a href="https://www.superpet.pe/eventos-y-actividades-superpet.html" target="_blank">Eventos y actividades</a></li>
              <li><a href="https://www.superpet.pe/super-solidarios.html" title="Jornadas de adopción" target="_blank">Jornadas de adopción</a></li>
              <li><a href="https://www.superpet.pe/charlas-online.html" title="Charlas online" target="_blank">Charlas online</a></li>
            </ul>
          </div>
          
        </div>
      </div>
      <div class="footer-bottom">
        <img src="https://www.superpet.pe/on/demandware.static/Sites-SuperPet-Site/-/default/dwd42376d6/fonts/logo_superpet_red.svg" alt="Logo SuperPet">
        <div class="copyright">
          © SuperPet - Todos los derechos reservados
        </div>
        <div class="social-links">
          <ul>
            <li>
              <a href="https://www.instagram.com/superpet_pe" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/superpet.pe" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5l0-170.3-52.8 0 0-78.2 52.8 0 0-33.7c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4l0 70.8c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2l0 27.8 83.6 0-14.4 78.2-69.3 0 0 175.9C413.8 494.8 512 386.9 512 256z"/></svg>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/channel/UCMcd3FCBavw7fVgQR0Fi-2w" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">><path d="M549.7 124.1C543.5 100.4 524.9 81.8 501.4 75.5 458.9 64 288.1 64 288.1 64S117.3 64 74.7 75.5C51.2 81.8 32.7 100.4 26.4 124.1 15 167 15 256.4 15 256.4s0 89.4 11.4 132.3c6.3 23.6 24.8 41.5 48.3 47.8 42.6 11.5 213.4 11.5 213.4 11.5s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zM232.2 337.6l0-162.4 142.7 81.2-142.7 81.2z"/></svg>
              </a>
            </li>
            <li>
              <a href="https://pe.linkedin.com/company/mascotaslatinas" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">><path d="M416 32L31.9 32C14.3 32 0 46.5 0 64.3L0 447.7C0 465.5 14.3 480 31.9 480L416 480c17.6 0 32-14.5 32-32.3l0-383.4C448 46.5 433.6 32 416 32zM135.4 416l-66.4 0 0-213.8 66.5 0 0 213.8-.1 0zM102.2 96a38.5 38.5 0 1 1 0 77 38.5 38.5 0 1 1 0-77zM384.3 416l-66.4 0 0-104c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9l0 105.8-66.4 0 0-213.8 63.7 0 0 29.2 .9 0c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9l0 117.2z"/></svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>`
  }
  connectedCallback(){
    this.render()
  }
}
customElements.define("footer-component",FooterComponent)