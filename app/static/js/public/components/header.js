class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const loggedIn = window.USER_SESSION || null;

    this.shadowRoot.innerHTML = `
      <style>
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #191919;
          color: #fff;
          padding: 1rem 2rem;
          font-family: 'Poppins', sans-serif;
        }
        nav ul {
          list-style: none;
          display: flex;
          gap: 1rem;
          margin: 0;
          padding: 0;
        }
        nav a {
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }
        nav a:hover {
            color: #b40500;
        }
        .logo a {
            font-size: 1.5rem;
            font-weight: bold;
            color: #b40500;
        }
        .auth {
          cursor: pointer;
          display: flex;
          gap: 10px;
          align-items: center;
        }
        button#logout {
            background: none;
            border: 1px solid #b40500;
            color: #b40500;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 4px;
        }
        button#logout:hover {
            background: #b40500;
            color: #fff;
        }
      </style>
      <nav>
        <div class="logo"><a href="/">🐶 SuperPet</a></div>
        <ul>
          <li><a href="/productos">Productos</a></li>
          <li><a href="/servicios">Servicios</a></li>
          <li><a href="/publicaciones">Publicaciones</a></li>
        </ul>
        <div class="auth">
          ${loggedIn ? `
            <span>👤 ${loggedIn.Username || loggedIn.nombre || 'Usuario'}</span>
            <button id="logout">Cerrar sesión</button>
          ` : `
            <a href="#" id="login-btn">Iniciar sesión</a> | <a href="/register">Registrarse</a>
          `}
        </div>
      </nav>
    `;
    this.shadowRoot.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", e => {
        const href = link.getAttribute("href");

        if (href === '#' && link.id === 'login-btn') {
          e.preventDefault();
          document.dispatchEvent(new CustomEvent('open-login'));
          return;
        }

        if (href.startsWith("/")) {
          e.preventDefault();
          window.history.pushState({}, "", href);
          window.dispatchEvent(new Event('popstate'));
        }
      });
    });

    if (loggedIn) {
      this.shadowRoot.querySelector("#logout").addEventListener("click", () => {
        fetch('/logout').then(() => {
          window.USER_SESSION = null;
          window.history.pushState({}, "", "/");
          window.dispatchEvent(new Event('popstate'));
          this.render();
        });
      });
    }
  }
}

customElements.define("header-component", HeaderComponent);
