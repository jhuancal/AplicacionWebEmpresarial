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
        let mainImage = '/static/img/not-found.jpg';
        if (pet.Fotos && pet.Fotos.length > 0) {
            mainImage = pet.Fotos[0];
        } else if (pet.UrlImagen) {
            mainImage = pet.UrlImagen;
        }

        const isAdopted = pet.DISPONIBILIDAD === 0;

        const isAlt = index % 2 !== 0 ? 'alt' : '';

        const card = document.createElement('div');
        card.className = `adoption-card ${isAlt} ${isAdopted ? 'adopted' : ''}`;

        const historia = pet.Historia || "Una mascota esperando un hogar lleno de amor.";
        const cuidados = pet.Cuidados || "Cuidados estándar";
        const edad = pet.FechaNacimiento ? pet.FechaNacimiento : "Desconocida";

        let buttonHtml = '';
        if (isAdopted) {
            buttonHtml = '<button class="adopt-btn is-disabled" disabled>Adoptado</button>';
        } else {
            buttonHtml = `<a href="#" class="adopt-btn" data-id="${pet.Id}" data-name="${pet.Nombre}">¡Adóptame!</a>`;
        }

        card.innerHTML = `
            <div class="adoption-img-container">
                 ${isAdopted ? '<span class="adoption-status-badge">Adoptado</span>' : ''}
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
    const logoutLink = document.querySelector('a[href="/logout"]');

    if (!logoutLink) {
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.classList.add('open');
        } else {
            alert("Por favor inicia sesión para adoptar.");
        }
        return;
    }

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
            filters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');

            const type = btn.dataset.filter;

            if (type === 'all') {
                renderAdoptionList(allPets);
            } else {
                const filtered = allPets.filter(item => item.Tipo && item.Tipo.toLowerCase() === type.toLowerCase());
                renderAdoptionList(filtered);
            }
        });
    });
}