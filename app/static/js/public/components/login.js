class LoginComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    open() {
        const modal = this.shadowRoot.querySelector('.modal');
        modal.style.display = 'flex';
    }

    close() {
        const modal = this.shadowRoot.querySelector('.modal');
        modal.style.display = 'none';
    }

    render() {
        this.shadowRoot.innerHTML = `
      <style>
        .modal {
          display: none; 
          position: fixed; 
          z-index: 1000; 
          left: 0;
          top: 0;
          width: 100%; 
          height: 100%; 
          overflow: auto; 
          background-color: rgba(0,0,0,0.5); 
          justify-content: center;
          align-items: center;
          font-family: 'Poppins', sans-serif;
        }
        .modal-content {
          background-color: #fefefe;
          padding: 2rem;
          border: 1px solid #888;
          width: 90%; 
          max-width: 400px;
          border-radius: 8px;
          position: relative;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
          position: absolute;
          top: 10px;
          right: 20px;
        }
        .close:hover,
        .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
        h2 {
            text-align: center;
            color: #333;
            margin-bottom: 1.5rem;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        button {
          padding: 10px;
          background-color: #b40500;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #8a0400;
        }
        .links {
            text-align: center;
            margin-top: 1rem;
            font-size: 0.9rem;
        }
        .links a {
            color: #b40500;
            text-decoration: none;
        }
      </style>
      
      <div id="loginModal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>Iniciar Sesión</h2>
          <form id="loginForm">
            <input type="text" name="username" placeholder="Usuario" required />
            <input type="password" name="password" placeholder="Contraseña" required />
            <button type="submit">Ingresar</button>
          </form>
          <div class="links">
              ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
          </div>
        </div>
      </div>
    `;

        // Close logic
        this.shadowRoot.querySelector(".close").addEventListener("click", () => this.close());

        // Outside click close
        this.shadowRoot.querySelector(".modal").addEventListener("click", (e) => {
            if (e.target === this.shadowRoot.querySelector(".modal")) {
                this.close();
            }
        });

        // Form Submit
        this.shadowRoot.querySelector("#loginForm").addEventListener("submit", e => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));

            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        window.USER_SESSION = response.user;
                        this.close();
                        alert("Login exitoso");

                        // If admin, redirect
                        if (window.USER_SESSION.Tipo !== 'Cliente') {
                            window.location.href = '/admin/dashboard';
                        } else {
                            // Refresh UI (Header needs to update)
                            // Dispatch event or just re-render header if we had access.
                            // Simpler: reload or custom event
                            document.querySelector('header-component').render();
                            // Navigate to home
                            window.history.pushState({}, "", "/");
                            window.dispatchEvent(new Event('popstate'));
                        }
                    } else {
                        alert("Error: " + response.message);
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Error de conexión");
                });
        });
    }
}

customElements.define("login-component", LoginComponent);
