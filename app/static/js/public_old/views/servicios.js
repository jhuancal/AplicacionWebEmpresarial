
import '../components/service-card.js';

export const servicesView = `
<div class="container" style="padding-top: 20px;">
    <h2 class="text-center mb-4" style="color: #fff; font-weight: 600;">Nuestros Servicios</h2>
    
    <div class="row mb-4">
        <div class="col-md-12 text-center">
            <div class="btn-group" role="group" id="filter-buttons">
                <button type="button" class="btn btn-outline-primary active" data-filter="all">Todos</button>
                <button type="button" class="btn btn-outline-primary" data-filter="Aseo">Aseo</button>
                <button type="button" class="btn btn-outline-primary" data-filter="Paseo">Paseo</button>
                <button type="button" class="btn btn-outline-primary" data-filter="Cuidado">Cuidado</button>
                <button type="button" class="btn btn-outline-primary" data-filter="Entrenamiento">Entrenamiento</button>
                <button type="button" class="btn btn-outline-primary" data-filter="Veterinaria">Veterinaria</button>
            </div>
        </div>
    </div>

    <div id="services-grid" class="row" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
        <!-- Services rendered here -->
    </div>
</div>

<!-- Booking Modal -->
<div class="modal fade" id="bookingModal" tabindex="-1" role="dialog" style="display: none; background: rgba(0,0,0,0.5);">
    <div class="modal-dialog" role="document" style="margin-top: 100px;">
        <div class="modal-content">
            <div class="modal-header" style="background: #222; color: #fff;">
                <h5 class="modal-title">Reservar Servicio</h5>
                <button type="button" class="close" onclick="$('#bookingModal').hide()" aria-label="Close" style="color: #fff;">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" style="background: #333; color: #fff;">
                <form id="bookingForm">
                    <input type="hidden" id="serviceId">
                    <div class="form-group">
                        <label>Servicio</label>
                        <input type="text" class="form-control" id="serviceName" disabled>
                    </div>
                    <div class="form-group">
                        <label>Costo</label>
                        <input type="text" class="form-control" id="serviceCost" disabled>
                    </div>
                    <div class="form-group">
                        <label for="petSelect">Selecciona tu Mascota</label>
                        <select class="form-control" id="petSelect" required>
                            <option value="">Cargando mascotas...</option>
                        </select>
                        <small class="form-text text-muted" id="petHelp">Si no tienes mascotas registradas, regístralas primero en tu perfil.</small>
                    </div>
                    <div class="form-group">
                        <label for="bookingDate">Fecha y Hora</label>
                        <input type="datetime-local" class="form-control" id="bookingDate" required>
                    </div>
                    <div class="form-group">
                        <label for="bookingObs">Observaciones</label>
                        <textarea class="form-control" id="bookingObs" rows="2"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="$('#bookingModal').hide()">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnConfirmBooking">Confirmar Reserva</button>
            </div>
        </div>
    </div>
</div>
`;

let servicesData = [];
let userPets = [];

export function initServices() {
    loadServices();
    loadUserPets();

    // Filter logic
    const buttons = document.querySelectorAll('#filter-buttons button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active', 'btn-primary'));
            buttons.forEach(b => b.classList.add('btn-outline-primary'));
            btn.classList.add('active', 'btn-primary');
            btn.classList.remove('btn-outline-primary');

            const filter = btn.getAttribute('data-filter');
            renderServices(filter);
        });
    });

    document.getElementById('btnConfirmBooking').addEventListener('click', createReservation);
}

function loadServices() {
    fetch('/api/servicios')
        .then(response => response.json())
        .then(data => {
            servicesData = data;
            renderServices('all');
        })
        .catch(err => console.error('Error loading services:', err));
}

function loadUserPets() {
    if (!window.USER_SESSION) return;
    fetch('/api/mis-mascotas')
        .then(response => response.json())
        .then(data => {
            userPets = data;
        })
        .catch(err => console.error('Error loading pets:', err));
}

function renderServices(category) {
    const grid = document.getElementById('services-grid');
    grid.innerHTML = '';

    const filtered = category === 'all'
        ? servicesData
        : servicesData.filter(s => s.Categoria === category);

    if (filtered.length === 0) {
        grid.innerHTML = '<p class="text-center w-100">No hay servicios disponibles en esta categoría.</p>';
        return;
    }

    filtered.forEach(service => {
        if (service.ESTADO === 0) return;

        // Placeholder image based on category
        let imgUrl = 'https://via.placeholder.com/300x200?text=Servicio';
        if (service.Categoria === 'Aseo') imgUrl = 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=300&q=80';
        else if (service.Categoria === 'Paseo') imgUrl = 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=300&q=80';
        else if (service.Categoria === 'Veterinaria') imgUrl = 'https://images.unsplash.com/photo-1628009368231-76033529841f?auto=format&fit=crop&w=300&q=80';

        const card = document.createElement('service-card');
        card.setAttribute('id', service.Id);
        card.setAttribute('nombre', service.Nombre);
        card.setAttribute('costo', service.Costo);
        card.setAttribute('duracion', service.DuracionMinutos);
        card.setAttribute('tipo', service.TipoMascota);
        card.setAttribute('categoria', service.Categoria);
        card.setAttribute('descripcion', service.Descripcion || '');
        card.setAttribute('img', imgUrl);

        // Event listener is handled by delegation or direct attachment. 
        // Since custom event bubbles, we can attach to grid or the card.
        // Attaching to card is safer for logic isolation.
        card.addEventListener('booking-request', (e) => {
            openBookingModal({
                Id: e.detail.id,
                Nombre: e.detail.nombre,
                Costo: e.detail.costo
            });
        });

        grid.appendChild(card);
    });
}

function openBookingModal(service) {
    if (!window.USER_SESSION) {
        // Redirect to login or show login modal
        alert("Debes iniciar sesión para reservar.");
        window.location.href = '/login'; // Or open login component
        return;
    }

    const modal = document.getElementById('bookingModal');
    document.getElementById('serviceId').value = service.Id;
    document.getElementById('serviceName').value = service.Nombre;
    document.getElementById('serviceCost').value = '$' + service.Costo;
    document.getElementById('bookingDate').value = '';
    document.getElementById('bookingObs').value = '';

    const petSelect = document.getElementById('petSelect');
    petSelect.innerHTML = '';

    if (userPets.length === 0) {
        const opt = document.createElement('option');
        opt.text = "No tienes mascotas registradas";
        opt.value = "";
        petSelect.add(opt);
        // document.getElementById('btnConfirmBooking').disabled = true;
    } else {
        userPets.forEach(pet => {
            const opt = document.createElement('option');
            opt.value = pet.Id;
            opt.text = pet.Nombre + ' (' + pet.Tipo + ')';
            petSelect.add(opt);
        });
        document.getElementById('btnConfirmBooking').disabled = false;
    }

    modal.style.display = 'block';

    //$(modal).show();
}

function createReservation() {
    const serviceId = document.getElementById('serviceId').value;
    const petId = document.getElementById('petSelect').value;
    const date = document.getElementById('bookingDate').value;
    const obs = document.getElementById('bookingObs').value;

    if (!petId) {
        alert("Debes seleccionar una mascota.");
        return;
    }
    if (!date) {
        alert("Debes seleccionar fecha y hora.");
        return;
    }

    const data = {
        IdCliente: window.USER_SESSION.Id,
        IdMascota: petId,
        IdServicio: serviceId,
        FechaHora: date,
        Observaciones: obs
    };

    fetch('/api/reservas/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                alert("Error: " + result.error);
            } else {
                alert("Reserva creada exitosamente!");
                $('#bookingModal').hide();
            }
        })
        .catch(err => {
            console.error(err);
            alert("Error al procesar la reserva.");
        });
}
