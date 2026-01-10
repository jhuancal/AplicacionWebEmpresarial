class ServiceCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return ['id', 'nombre', 'costo', 'duracion', 'tipo', 'categoria', 'descripcion', 'img'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const id = this.getAttribute("id");
        const nombre = this.getAttribute("nombre");
        const costo = this.getAttribute("costo");
        const duracion = this.getAttribute("duracion");
        const tipo = this.getAttribute("tipo");
        // const categoria = this.getAttribute("categoria");
        const descripcion = this.getAttribute("descripcion") || 'Sin descripción';
        const img = this.getAttribute("img");

        this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
      :host {
        display: block;
        width: 300px;
      }
      .card {
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        background: white;
        display: flex;
        flex-direction: column;
        height: 100%;
        transition: transform 0.2s;
      }
      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      }
      img {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      .card-body {
        padding: 15px;
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .card-title {
        margin: 0 0 10px;
        font-weight: 600;
        font-size: 1.1em;
        color: #333;
      }
      .card-text {
        color: #666;
        font-size: 0.9em;
        flex: 1;
        margin-bottom: 15px;
      }
      .list-unstyled {
        list-style: none;
        padding: 0;
        margin: 0 0 15px;
        font-size: 0.85em;
        color: #555;
      }
      .list-unstyled li {
        margin-bottom: 5px;
      }
      .btn-book {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
        font-size: 1em;
        transition: background-color 0.2s;
      }
      .btn-book:hover {
        background-color: #0056b3;
      }
    </style>
    <div class="card">
      <img src="${img}" alt="${nombre}">
      <div class="card-body">
        <h5 class="card-title">${nombre}</h5>
        <p class="card-text">${descripcion}</p>
        <ul class="list-unstyled">
            <li><strong><i class="fa fa-paw"></i> Mascota:</strong> ${tipo}</li>
            <li><strong><i class="fa fa-clock-o"></i> Duración:</strong> ${duracion} min</li>
            <li><strong><i class="fa fa-money"></i> Costo:</strong> $${costo}</li>
        </ul>
        <button class="btn-book" id="btnBook">Reservar</button>
      </div>
    </div>
    `;

        this.shadowRoot.getElementById('btnBook').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('booking-request', {
                detail: {
                    id: id,
                    nombre: nombre,
                    costo: costo
                },
                bubbles: true,
                composed: true
            }));
        });
    }
}
customElements.define("service-card", ServiceCard);
