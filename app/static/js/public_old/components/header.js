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
        .cart-icon {
            position: relative;
            color: white;
            text-decoration: none;
            margin-right: 15px;
            font-size: 1.2rem;
            cursor: pointer;
        }
        .cart-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #b40500;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 0.7rem;
            font-weight: bold;
        }
      </style>
      <nav>
        <div class="logo"><a href="/">🐶 AlmasSalvajes</a></div>
        <ul>
          <li><a href="/adopcion">Adopción</a></li>
          <li><a href="/productos">Productos</a></li>
          <li><a href="/servicios">Servicios</a></li>
          <li><a href="/publicaciones">Publicaciones</a></li>
        </ul>
        <div class="auth">
          ${loggedIn ? `
            <a href="/carrito" class="cart-icon" id="cart-btn">
                🛒 <span class="cart-badge" id="cart-count">0</span>
            </a>
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
          // Allow default navigation for new pages usually, but if using SPA router:
          // e.preventDefault();
          // window.history.pushState({}, "", href);
          // window.dispatchEvent(new Event('popstate'));
        }
      });
    });

    if (loggedIn) {
      this.updateCartCount();

      this.shadowRoot.querySelector("#logout").addEventListener("click", () => {
        fetch('/logout').then(() => {
          window.USER_SESSION = null;
          window.location.href = '/';
        });
      });
    }
  }

  async updateCartCount() {
    try {
      const res = await fetch('/api/carrito/items');
      if (res.ok) {
        const items = await res.json();
        const count = items.reduce((acc, item) => acc + item.Cantidad, 0);
        const badge = this.shadowRoot.getElementById('cart-count');
        if (badge) badge.innerText = count;
      }
    } catch (e) {
      console.error("Error fetching cart count", e);
    }
  }
}


customElements.define("header-component", HeaderComponent);
