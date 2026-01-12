const adoptionView = `
    <div style="padding: 2rem;">
        <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 2rem; color: #333;">🐾 Adopta una Mascota</h2>
        <p style="text-align: center; margin-bottom: 3rem; color: #666; max-width: 600px; margin-left: auto; margin-right: auto;">
            Estas mascotas buscan un hogar lleno de amor. Conoce sus historias y dales una segunda oportunidad.
        </p>
        <div id="pets-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
            <!-- Pets render here -->
        </div>
    </div>
`;

function initAdoption() {
    fetch('/api/public/mascotas')
        .then(r => r.json())
        .then(pets => {
            const container = document.getElementById('pets-container');
            if (pets.length === 0) {
                if (container) container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No hay mascotas disponibles para adopción en este momento.</p>';
                return;
            }
            if (container) container.innerHTML = pets.map(pet => {
                const photo = (pet.Fotos && pet.Fotos.length > 0) ? pet.Fotos[0] : 'https://via.placeholder.com/300x200?text=Sin+Foto';
                // Check if adopted (Unavailable = 0)
                const isAdopted = pet.DISPONIBILIDAD === 0;

                let buttonHtml = '';
                if (isAdopted) {
                    buttonHtml = `<button disabled style="width: 100%; padding: 10px; background: #ccc; color: #666; border: none; border-radius: 4px; font-weight: bold; cursor: not-allowed;">Adoptado</button>`;
                } else {
                    buttonHtml = `<button class="btn-adopt" data-id="${pet.Id}" data-name="${pet.Nombre}" style="width: 100%; padding: 10px; background: #ff7043; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                            Adoptar a ${pet.Nombre}
                        </button>`;
                }

                return `
                <div style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s; position: relative;">
                    ${isAdopted ? '<div style="position: absolute; top: 10px; right: 10px; background: #d32f2f; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">Adoptado</div>' : ''}
                    <div style="height: 200px; overflow: hidden;">
                        <img src="${photo}" style="width: 100%; height: 100%; object-fit: cover; filter: ${isAdopted ? 'grayscale(100%)' : 'none'};" alt="${pet.Nombre}">
                    </div>
                    <div style="padding: 1.5rem;">
                        <span style="background: #e0f2f1; color: #00695c; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">${pet.Tipo || 'Mascota'}</span>
                        <h3 style="margin: 0.5rem 0; font-size: 1.5rem; color: #333;">${pet.Nombre}</h3>
                        <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">${pet.Raza || 'Mestizo'} • ${pet.FechaNacimiento || 'Edad desconocida'}</p>
                        
                        <div style="margin-bottom: 1rem;">
                            <p style="font-size: 0.9rem; color: #555;"><strong>Historia:</strong> ${pet.Historia || 'Una historia especial...'}</p>
                        </div>

                        ${buttonHtml}
                    </div>
                </div>
                `;
            }).join('');

            // Add Event Listeners
            document.querySelectorAll('.btn-adopt').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const name = e.target.getAttribute('data-name');
                    solicitarAdopcion(id, name);
                });
            });
        });
}

function solicitarAdopcion(idMascota, nombreMascota) {
    if (!window.USER_SESSION) {
        // Trigger generic login modal if available, or redirect
        // Assuming login-component listens to something or we just alert
        alert("Debes iniciar sesión para adoptar.");
        // Optional: Redirect to login or open modal
        // window.location.href = '/login'; 
        const loginComponent = document.querySelector('login-component');
        if (loginComponent) {
            // Hack to open login modal if component exposes method or we assume its structure
            // Usually components listen to events.
        }
        return;
    }

    if (confirm(`¿Estás seguro que deseas enviar una solicitud para adoptar a ${nombreMascota}?`)) {
        fetch('/api/adopcion/solicitar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_mascota: idMascota })
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    alert("Tu solicitud ha sido enviada, espera la respuesta del administrador.");
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(err => {
                console.error(err);
                alert("Ocurrió un error al procesar la solicitud.");
            });
    }
}

export { adoptionView, initAdoption };
