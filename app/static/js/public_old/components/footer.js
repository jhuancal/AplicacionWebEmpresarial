class FooterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          background: #191919;
          color: #fff;
          text-align: center;
          padding: 2rem 1rem;
          margin-top: auto;
          font-family: 'Poppins', sans-serif;
        }
        p {
            margin: 0;
            font-size: 0.9rem;
            color: #aaa;
        }
      </style>
      <footer>
        <p>&copy; 2025 AlmasSalvajes - Todos los derechos reservados</p>
      </footer>
    `;
  }
}

customElements.define("footer-component", FooterComponent);
