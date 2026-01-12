/* Mock Data provided by User */
const rawPublications = [
    {
        "Autor": "abelcliente",
        "Contenido": "Paseando con mi mascota",
        "DISPONIBILIDAD": 1,
        "ESTADO": 1,
        "FECHA_CREACION": 0,
        "FECHA_MODIFICACION": 0,
        "FechaPublicacion": "Sun, 11 Jan 2026 01:44:27 GMT",
        "Id": "3b5bc83c-3646-4ba7-9dfe-dcded3d6bedd",
        "IdCliente": "C1111111-1111-1111-1111-111111111111",
        "IdPersona": "P1111111-1111-1111-1111-111111111111",
        "Likes": 0,
        "Media": [
            {
                "DISPONIBILIDAD": 1,
                "ESTADO": 1,
                "FECHA_CREACION": 0,
                "FECHA_MODIFICACION": 0,
                "Id": "dc0f9c50-bc81-47b5-a367-49409ba79bbc",
                "IdPublicacion": "3b5bc83c-3646-4ba7-9dfe-dcded3d6bedd",
                "RowVersion": "Sun, 11 Jan 2026 01:44:27 GMT",
                "TipoMedia": "Imagen",
                "USER_CREACION": "admin",
                "USER_MODIFICACION": "admin",
                "Url": "/static/img_new/post-8.jpg"
            }
        ],
        "RowVersion": "Sun, 11 Jan 2026 01:44:27 GMT",
        "USER_CREACION": "admin",
        "USER_MODIFICACION": "admin"
    },
    {
        "Autor": "bruno",
        "Contenido": "¡Disfrutando un día de parque con mi perro! 🌳🐶",
        "DISPONIBILIDAD": 1,
        "ESTADO": 1,
        "FECHA_CREACION": 0,
        "FECHA_MODIFICACION": 0,
        "FechaPublicacion": "Sun, 11 Jan 2026 01:42:47 GMT",
        "Id": "pub-001",
        "IdCliente": "C2222222-2222-2222-2222-222222222222",
        "IdPersona": "P2222222-2222-2222-2222-222222222222",
        "Likes": 15,
        "Media": [
            {
                "DISPONIBILIDAD": 1,
                "ESTADO": 1,
                "FECHA_CREACION": 0,
                "FECHA_MODIFICACION": 0,
                "Id": "med-001",
                "IdPublicacion": "pub-001",
                "RowVersion": "Sun, 11 Jan 2026 01:42:49 GMT",
                "TipoMedia": "Imagen",
                "USER_CREACION": "SYS",
                "USER_MODIFICACION": "SYS",
                "Url": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            }
        ],
        "RowVersion": "Sun, 11 Jan 2026 01:42:47 GMT",
        "USER_CREACION": "SYS",
        "USER_MODIFICACION": "SYS"
    },
    {
        "Autor": "abelcliente",
        "Contenido": "Mi gato aprendió un nuevo truco hoy. 😺",
        "DISPONIBILIDAD": 1,
        "ESTADO": 1,
        "FECHA_CREACION": 0,
        "FECHA_MODIFICACION": 0,
        "FechaPublicacion": "Sat, 10 Jan 2026 01:42:47 GMT",
        "Id": "pub-002",
        "IdCliente": "C1111111-1111-1111-1111-111111111111",
        "IdPersona": "P1111111-1111-1111-1111-111111111111",
        "Likes": 24,
        "Media": [
            {
                "DISPONIBILIDAD": 1,
                "ESTADO": 1,
                "FECHA_CREACION": 0,
                "FECHA_MODIFICACION": 0,
                "Id": "med-002",
                "IdPublicacion": "pub-002",
                "RowVersion": "Sun, 11 Jan 2026 01:42:49 GMT",
                "TipoMedia": "Imagen",
                "USER_CREACION": "SYS",
                "USER_MODIFICACION": "SYS",
                "Url": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            }
        ],
        "RowVersion": "Sun, 11 Jan 2026 01:42:47 GMT",
        "USER_CREACION": "SYS",
        "USER_MODIFICACION": "SYS"
    },
    {
        "Autor": "bruno",
        "Contenido": "Mirad qué bonito collar le compré a Bobby en SuperPet.",
        "DISPONIBILIDAD": 1,
        "ESTADO": 1,
        "FECHA_CREACION": 0,
        "FECHA_MODIFICACION": 0,
        "FechaPublicacion": "Fri, 09 Jan 2026 01:42:47 GMT",
        "Id": "pub-003",
        "IdCliente": "C2222222-2222-2222-2222-222222222222",
        "IdPersona": "P2222222-2222-2222-2222-222222222222",
        "Likes": 10,
        "Media": [
            {
                "DISPONIBILIDAD": 1,
                "ESTADO": 1,
                "FECHA_CREACION": 0,
                "FECHA_MODIFICACION": 0,
                "Id": "med-003",
                "IdPublicacion": "pub-003",
                "RowVersion": "Sun, 11 Jan 2026 01:42:49 GMT",
                "TipoMedia": "Imagen",
                "USER_CREACION": "SYS",
                "USER_MODIFICACION": "SYS",
                "Url": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            }
        ],
        "RowVersion": "Sun, 11 Jan 2026 01:42:47 GMT",
        "USER_CREACION": "SYS",
        "USER_MODIFICACION": "SYS"
    }
];

// Current User Simulation (Logged In)
const currentUser = "abelcliente";

// State
let allPublications = [...rawPublications];

document.addEventListener('DOMContentLoaded', () => {
    refreshFeeds();
    setupFilters();
    setupCreatePost();
});

function refreshFeeds() {
    renderPublicFeed();
    renderPersonalFeed();
}

function renderPublicFeed() {
    const container = document.getElementById('public-feed-container');
    const filterText = document.getElementById('filter-text').value.toLowerCase();

    const filtered = allPublications.filter(pub => {
        const matchesText = pub.Contenido.toLowerCase().includes(filterText) || pub.Autor.toLowerCase().includes(filterText);
        return matchesText;
    });

    container.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = '<p class="has-text-centered has-text-grey">No hay publicaciones públicas.</p>';
        return;
    }

    filtered.forEach(pub => {
        const card = createPostCard(pub);
        container.appendChild(card);
    });
}

function renderPersonalFeed() {
    const container = document.getElementById('personal-feed-container');

    // Only posts by currentUser
    const personalPosts = allPublications.filter(pub => pub.Autor === currentUser);

    container.innerHTML = '';

    if (personalPosts.length === 0) {
        container.innerHTML = '<p class="has-text-centered has-text-grey">Aún no has publicado nada.</p>';
        return;
    }

    personalPosts.forEach(pub => {
        const card = createPostCard(pub);
        container.appendChild(card);
    });
}

function createPostCard(pub) {
    const div = document.createElement('div');
    div.className = 'post-card';

    // Fallback Image handling
    let mediaHtml = '';
    if (pub.Media && pub.Media.length > 0) {
        let url = pub.Media[0].Url;
        // Clean url if internal
        if (url.startsWith('/static/uploads/')) {
            url = '/static/img_new/slider-3.jpg'; // fallback for internal server images not present
        }
        mediaHtml = `
            <div class="post-media-container">
                <img src="${url}" alt="Post image" class="post-img">
            </div>
         `;
    }

    // Format Date (Simple)
    const dateStr = new Date(pub.FechaPublicacion).toLocaleDateString();

    div.innerHTML = `
        <div class="post-header">
            <div class="post-author-info">
                <img src="https://ui-avatars.com/api/?name=${pub.Autor}&background=random" class="user-avatar-small">
                <div>
                    <h5 class="author-name">${pub.Autor}</h5>
                    <span class="post-time">${dateStr}</span>
                </div>
            </div>
            <i class="zmdi zmdi-more-vert" style="cursor: pointer;"></i>
        </div>
        <div class="post-text">
            ${pub.Contenido}
        </div>
        ${mediaHtml}
        <div class="post-footer">
            <div class="post-stats">
                <span>${pub.Likes} Likes</span>
                <span>0 Comentarios</span>
            </div>
            <div class="post-actions">
                <button class="feed-action-btn"><i class="zmdi zmdi-thumb-up"></i> Me gusta</button>
                <button class="feed-action-btn"><i class="zmdi zmdi-comment-outline"></i> Comentar</button>
                <button class="feed-action-btn"><i class="zmdi zmdi-share"></i> Compartir</button>
            </div>
        </div>
    `;
    return div;
}

function setupFilters() {
    const input = document.getElementById('filter-text');
    input.addEventListener('input', () => {
        renderPublicFeed(); // Only filtering public feed as requested
    });
}

function setupCreatePost() {
    const btn = document.getElementById('btn-publish');
    const input = document.getElementById('new-post-content');

    btn.addEventListener('click', () => {
        const content = input.value.trim();
        if (!content) return;

        // Mock creation
        const newPost = {
            "Autor": currentUser,
            "Contenido": content,
            "FechaPublicacion": new Date().toUTCString(),
            "Id": "new-" + Date.now(),
            "Likes": 0,
            "Media": [
                { "Url": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=80" } // Random image fallback for demo
            ]
        };

        // Add to TOP of array
        allPublications.unshift(newPost);

        // Reset and Refresh
        input.value = '';
        refreshFeeds();

        // Mock feedback
        alert('Publicación subida con éxito!');
    });
}
