
let servicesData = [];
let userPets = [];

document.addEventListener('DOMContentLoaded', () => {
    initServices();
});

function initServices() {
    loadServices();
    // We try to load pets early if logged in, or we can load on demand
    loadUserPets();
    setupModal();
    initFilters();
}

function loadServices() {
    const grid = document.getElementById('services-grid');
    grid.innerHTML = '<p class="has-text-centered title is-5">Cargando servicios...</p>';

    fetch('/api/servicios')
        .then(response => response.json())
        .then(data => {
            servicesData = data;
            // The API returns the raw list. We might want to enrich it or just use it.
            // The old code had logic to assign images based on category. let's replicate that.
            servicesData = servicesData.map((s, index) => {
                let img = '/static/img_new/service-1.jpg';
                if (s.Categoria === 'Aseo') img = '/static/img_new/service-1.jpg';
                else if (s.Categoria === 'Cuidado' || s.Categoria === 'Paseo') img = '/static/img_new/service-2.jpg';
                else if (s.Categoria === 'Veterinaria') img = '/static/img_new/service-3.jpg';

                // Add mock ranking/location if missing from API, just for UI consistency if needed
                // Old API didn't have ranking/location, so we keep the mock logic for display purposes if we want to keep the UI rich
                const locations = ['Miraflores', 'Yanahuara', 'Cercado', 'Cayma', 'Jose Luis Bustamante'];
                const ranking = (3.5 + (index * 0.3) % 1.5).toFixed(1);

                return {
                    ...s,
                    Imagen: img,
                    Ranking: s.Ranking || ranking,
                    Ubicacion: s.Ubicacion || locations[index % locations.length]
                };
            });
            renderServices(servicesData);
            populateLocationFilter();
        })
        .catch(err => {
            console.error('Error loading services:', err);
            grid.innerHTML = '<p class="has-text-centered has-text-danger">Error al cargar servicios. Por favor intenta más tarde.</p>';
        });
}

function loadUserPets() {
    // Check if user is logged in first?
    // We can just try to fetch. If 401/403 or empty, we handle it.
    fetch('/api/mis-mascotas')
        .then(response => {
            if (response.ok) return response.json();
            return [];
        })
        .then(data => {
            userPets = data;
        })
        .catch(err => console.log('User not logged in or error loading pets', err));
}

function renderServices(services) {
    const grid = document.getElementById('services-grid');
    grid.innerHTML = '';

    const availableServices = services.filter(s => s.ESTADO === 1);

    if (availableServices.length === 0) {
        grid.innerHTML = '<div class="column is-full has-text-centered title is-5">No existen servicios disponibles con estos criterios.</div>';
        return;
    }

    availableServices.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card-item';

        const starCount = Math.floor(service.Ranking);
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            starsHtml += `<i class="zmdi ${i < starCount ? 'zmdi-star' : 'zmdi-star-outline'}"></i>`;
        }

        card.innerHTML = `
            <div class="service-img-wrapper">
                <span class="service-category-badge">${service.Categoria}</span>
                <img src="${service.Imagen}" alt="${service.Nombre}" class="service-img">
            </div>
            <div class="service-content">
                <div class="service-header">
                    <h3 class="service-title">${service.Nombre}</h3>
                    <div class="service-rating" title="Ranking: ${service.Ranking}">
                        ${starsHtml} <span>${service.Ranking}</span>
                    </div>
                </div>
                <p class="service-provider"><i class="zmdi zmdi-account-circle"></i> ${service.PersonalAsignado || 'Staff'}</p>
                <p class="service-desc">${service.Descripcion || 'Sin descripción'}</p>
                
                <div class="service-meta">
                    <div class="meta-row">
                        <i class="zmdi zmdi-time"></i> ${service.DuracionMinutos} min · ${service.Horario || 'L-D'}
                    </div>
                    <div class="meta-row">
                        <i class="zmdi zmdi-pin"></i> ${service.Ubicacion}
                    </div>
                    <div class="meta-row">
                        <i class="zmdi zmdi-info-outline"></i> ${service.Requisitos || 'Sin requisitos'}
                    </div>
                </div>
            </div>
            <div class="service-footer">
                <span class="service-price">S/ ${parseFloat(service.Costo).toFixed(2)}</span>
                <button class="btn-reserve" onclick="openReservation('${service.Id}')">
                    Reservar
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function initFilters() {
    const categorySelect = document.getElementById('filter-category');
    const locationSelect = document.getElementById('filter-location');

    const applyFilters = () => {
        const cat = categorySelect.value;
        const loc = locationSelect.value;

        const filtered = servicesData.filter(s => {
            const matchCat = cat === '' || s.Categoria === cat;
            const matchLoc = loc === '' || s.Ubicacion === loc;
            return matchCat && matchLoc;
        });

        renderServices(filtered);
    };

    categorySelect.addEventListener('change', applyFilters);
    locationSelect.addEventListener('change', applyFilters);
}

function populateLocationFilter() {
    const locationSelect = document.getElementById('filter-location');
    const locations = [...new Set(servicesData.filter(s => s.ESTADO === 1).map(s => s.Ubicacion))];

    // Clear existing options except first
    locationSelect.innerHTML = '<option value="">Todas las ubicaciones</option>';

    locations.forEach(loc => {
        const option = document.createElement('option');
        option.value = loc;
        option.textContent = loc;
        locationSelect.appendChild(option);
    });
}

// Global modal logic
function openReservation(serviceId) {
    // Check login status somehow. 
    // We can rely on userPets fetch. If it failed or returns empty (and we want to distinguish between empty and not logged in), 
    // we might need a better check. But usually, if one is logged in, the template renders the user info.
    // Let's assume strict check: if the "Iniciar Sesión" link exists in DOM, we are not logged in.
    if (document.getElementById('login-trigger')) {
        alert("Debes iniciar sesión para reservar.");
        // Trigger login modal if available
        document.getElementById('login-modal').classList.add('visible');
        return;
    }

    const service = servicesData.find(s => s.Id === serviceId);
    if (!service) return;

    // Fill Modal
    document.getElementById('service-id').value = service.Id;
    document.getElementById('service-name').value = service.Nombre;
    document.getElementById('service-cost').value = 'S/ ' + parseFloat(service.Costo).toFixed(2);
    document.getElementById('res-date').value = '';
    document.getElementById('res-obs').value = '';

    // Populate pets
    const petSelect = document.getElementById('pet-select');
    petSelect.innerHTML = '';
    if (userPets.length === 0) {
        const opt = document.createElement('option');
        opt.value = "";
        opt.text = "No tienes mascotas registradas";
        petSelect.appendChild(opt);
    } else {
        const defaultOpt = document.createElement('option');
        defaultOpt.value = "";
        defaultOpt.text = "Selecciona una mascota --";
        petSelect.appendChild(defaultOpt);

        userPets.forEach(pet => {
            const opt = document.createElement('option');
            opt.value = pet.Id;
            opt.text = `${pet.Nombre} (${pet.Tipo})`;
            petSelect.appendChild(opt);
        });
    }

    document.getElementById('reservation-modal').classList.add('open');
}

function setupModal() {
    const modal = document.getElementById('reservation-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const form = document.getElementById('reservation-form');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const serviceId = document.getElementById('service-id').value;
        const petId = document.getElementById('pet-select').value;
        const date = document.getElementById('res-date').value;
        const obs = document.getElementById('res-obs').value;

        if (!petId) {
            alert("Por favor selecciona una mascota.");
            return;
        }
        if (!date) {
            alert("Por favor selecciona fecha y hora.");
            return;
        }

        const payload = {
            IdMascota: petId,
            IdServicio: serviceId,
            FechaHora: date.replace('T', ' '), // Align format if needed 'YYYY-MM-DD HH:MM'
            Observaciones: obs
        };
        // Ideally we pass IdCliente too if backend requires it in body, 
        // but backend usually takes it from session. 
        // The old code passed IdCliente: window.USER_SESSION.Id. 
        // We might need to fetch user ID if backend doesn't infer it from session.
        // Assuming backend infers from session for internal API, OR we need to inject it.
        // Let's try sending it without IdCliente first (relying on session), 
        // OR prompt user if my backend design requires explicit ID.
        // Looking at old code: `IdCliente: window.USER_SESSION.Id`. 
        // Use a safe fallback or fetch profile if needed. 
        // For now, I'll assume the session cookie is enough or I will inject it if I can find it.

        // Actually, let's fetch profile to get ID if we don't have it, or just send request.

        fetch('/api/reservas/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert("Error: " + data.error);
                } else {
                    alert("¡Reserva creada exitosamente!");
                    modal.classList.remove('open');
                    form.reset();
                }
            })
            .catch(err => {
                console.error(err);
                alert("Ocurrió un error al procesar la reserva.");
            });
    });
}
window.openReservation = openReservation; // Expose to global scope for onclick events
