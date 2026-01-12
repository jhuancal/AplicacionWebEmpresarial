document.addEventListener('DOMContentLoaded', () => {
    fetchPets();
    setupAdoptionModal();
});

let availablePets = [];
let currentPetId = null;

function fetchPets() {
    fetch('/api/public/mascotas')
        .then(response => response.json())
        .then(pets => {
            availablePets = pets;
            renderAdoptionList(pets);
            setupFilters(pets);
        })
        .catch(error => console.error('Error loading pets:', error));
}

function renderAdoptionList(pets) {
    const listContainer = document.getElementById('adopciones-list');
    listContainer.innerHTML = '';

    if (pets.length === 0) {
        listContainer.innerHTML = '<p class="has-text-centered title is-4">No se encontraron mascotas.</p>';
        return;
    }

    pets.forEach((pet, index) => {
        // Fallback for photo
        let mainImage = '/static/img_new/gallery-1-thumb.jpg';
        if (pet.Fotos && pet.Fotos.length > 0) {
            mainImage = pet.Fotos[0].Url;
        } else if (pet.UrlImagen) {
            // Some APIs might return UrlImagen directly on the object
            mainImage = pet.UrlImagen;
        }

        // Check availability
        const isAdopted = pet.DISPONIBILIDAD === 0;

        // Alternating logic: Even indexes normal (Row), Odd indexes reversed (Row-Reverse)
        const isAlt = index % 2 !== 0 ? 'alt' : '';

        const card = document.createElement('div');
        card.className = `adoption-card ${isAlt}`;

        const historia = pet.Historia || "Una mascota esperando un hogar lleno de amor.";
        const cuidados = pet.Cuidados || "Cuidados estándar";
        const edad = pet.FechaNacimiento ? pet.FechaNacimiento : "Desconocida";

        let buttonHtml = '';
        if (isAdopted) {
            buttonHtml = '<button class="adopt-btn" disabled style="background-color: #ccc; cursor: not-allowed;">Adoptado</button>';
        } else {
            // We pass ID and Name to the handler
            buttonHtml = `<a href="#" class="adopt-btn" data-id="${pet.Id}" data-name="${pet.Nombre}">¡Adóptame!</a>`;
        }

        card.innerHTML = `
            <div class="adoption-img-container">
                 ${isAdopted ? '<span style="position:absolute; top:10px; right:10px; background:#d32f2f; color:white; padding:5px 10px; border-radius:4px; font-weight:bold; z-index:10;">Adoptado</span>' : ''}
                 <img src="${mainImage}" alt="${pet.Nombre}" class="adoption-img">
            </div>
            <div class="adoption-info">
                <h2 class="adoption-name">${pet.Nombre}</h2>
                <span class="adoption-breed">
                    <i class="zmdi zmdi-paw"></i> ${pet.Raza || 'Mestizo'} (${pet.Tipo})
                </span>
                
                <h4 class="adoption-history-title">Mi Historia</h4>
                <p class="adoption-history">"${historia}"</p>
                
                <div class="adoption-details">
                    <div class="detail-item">
                        <span class="detail-label">Nacimiento</span>
                        <span class="detail-value">${edad}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Cuidados</span>
                        <span class="detail-value">${cuidados}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Origen</span>
                        <span class="detail-value">${pet.Origen || 'Rescatado'}</span>
                    </div>
                </div>

                ${buttonHtml}
            </div>
        `;

        listContainer.appendChild(card);
    });

    // Attach click events to buttons
    document.querySelectorAll('.adopt-btn').forEach(btn => {
        if (!btn.disabled) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.dataset.id;
                const name = btn.dataset.name;
                handleAdoptClick(id, name);
            });
        }
    });
}

function handleAdoptClick(id, name) {
    // Check if user is logged in
    // We can check by looking for the "Cerrar Sesión" link in the navbar
    const logoutLink = document.querySelector('a[href="/logout"]');

    if (!logoutLink) {
        // Not logged in -> Open Login Modal
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.classList.add('open');
            // Optional: Add a message in the login modal saying "Log in to adopt"
        } else {
            alert("Por favor inicia sesión para adoptar.");
        }
        return;
    }

    // Logged in -> Open Confirm Modal
    currentPetId = id;
    const confirmModal = document.getElementById('adoption-modal');
    const msg = document.getElementById('adoption-modal-message');
    msg.textContent = `¿Estás seguro que deseas enviar una solicitud para adoptar a ${name}?`;

    confirmModal.classList.add('open');
}

function setupAdoptionModal() {
    const modal = document.getElementById('adoption-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = document.getElementById('btn-cancel-adopt');
    const confirmBtn = document.getElementById('btn-confirm-adopt');

    const closeModal = () => {
        modal.classList.remove('open');
        currentPetId = null;
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    confirmBtn.addEventListener('click', () => {
        if (currentPetId) {
            submitAdoptionRequest(currentPetId);
        }
    });
}

async function submitAdoptionRequest(petId) {
    try {
        const response = await fetch('/api/adopcion/solicitar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_mascota: petId })
        });

        const data = await response.json();
        const modal = document.getElementById('adoption-modal');

        if (data.success) {
            alert("¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto.");
            modal.classList.remove('open');
            // Refresh list to potentially show updated state (though backend might not auto-update disponibilidade instantly, manual refresh is safer)
            fetchPets();
        } else {
            alert(data.message || "Error al procesar la solicitud.");
            modal.classList.remove('open');
        }
    } catch (error) {
        console.error('Adoption request error:', error);
        alert("Ocurrió un error de conexión.");
        document.getElementById('adoption-modal').classList.remove('open');
    }
}


function setupFilters(allPets) {
    const filters = document.querySelectorAll('.adoption-filter-btn');

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filters.forEach(f => f.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const type = btn.dataset.filter;

            if (type === 'all') {
                renderAdoptionList(allPets);
            } else {
                // Filter by type (assuming Tipo matches or close enough)
                const filtered = allPets.filter(item => item.Tipo && item.Tipo.toLowerCase() === type.toLowerCase());
                renderAdoptionList(filtered);
            }
        });
    });
}
