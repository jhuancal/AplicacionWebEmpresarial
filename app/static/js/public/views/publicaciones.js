
let currentUser = null;
let allPublications = [];

document.addEventListener('DOMContentLoaded', () => {
    initPublications();
});

function initPublications() {
    checkLogin();
    loadFeed();
    setupFilters();
    setupCreatePost();
}

function checkLogin() {
    // Check if "Iniciar Sesión" link exists in navbar to determine guest status
    const loginLink = document.getElementById('login-trigger');
    const layout = document.querySelector('.feed-layout');

    if (loginLink) {
        // Guest Mode
        layout.classList.add('guest-mode');
        currentUser = null;
    } else {
        // User Mode
        layout.classList.remove('guest-mode');
        // Retrieve username from navbar if possible, or fetch profile.
        // For visual display, we can try to grab it from the "Hola, User" element
        const userNav = document.querySelector('.navbar-item span.navbar-a');
        if (userNav && userNav.textContent.includes('Hola,')) {
            const name = userNav.textContent.replace('Hola,', '').trim();
            currentUser = name;
            document.getElementById('current-user-name').textContent = `Hola, ${name}`;
            document.getElementById('current-user-avatar').src = `https://ui-avatars.com/api/?name=${name}&background=random`;
        }
    }
}

async function loadFeed() {
    const publicContainer = document.getElementById('public-feed-container');
    const personalContainer = document.getElementById('personal-feed-container');

    publicContainer.innerHTML = '<p class="has-text-centered">Cargando...</p>';
    if (currentUser) personalContainer.innerHTML = '<p class="has-text-centered">Cargando...</p>';

    try {
        const response = await fetch('/api/publicaciones/feed'); // This endpoint should return all posts
        if (!response.ok) throw new Error('Error fetching feed');

        const data = await response.json();
        allPublications = data; // Store globally for filtering

        renderFeeds();

    } catch (error) {
        console.error(error);
        publicContainer.innerHTML = '<p class="has-text-centered has-text-danger">Error al cargar publicaciones.</p>';
        if (currentUser) personalContainer.innerHTML = '<p class="has-text-centered has-text-danger">Error.</p>';
    }
}

function renderFeeds() {
    renderPublicFeed();
    if (currentUser) {
        renderPersonalFeed();
    }
}

function renderPublicFeed() {
    const container = document.getElementById('public-feed-container');
    const filterText = document.getElementById('filter-text').value.toLowerCase();

    // Filter public posts
    // If backend returns everything mixed, we can filter.
    // Assuming backend returns a list of post objects.
    const filtered = allPublications.filter(pub => {
        const content = pub.Contenido || '';
        const author = pub.Autor || '';
        return content.toLowerCase().includes(filterText) || author.toLowerCase().includes(filterText);
    });

    container.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = '<p class="has-text-centered has-text-grey">No se encontraron publicaciones.</p>';
        return;
    }

    filtered.forEach(pub => {
        container.appendChild(createPostCard(pub));
    });
}

function renderPersonalFeed() {
    const container = document.getElementById('personal-feed-container');
    if (!container) return; // Should exist if logged in, but check safety

    const myPosts = allPublications.filter(pub => pub.Autor === currentUser); // Or filtering by some userId if available

    container.innerHTML = '';

    if (myPosts.length === 0) {
        container.innerHTML = '<p class="has-text-centered has-text-grey">Aún no has publicado nada.</p>';
        return;
    }

    myPosts.forEach(pub => {
        container.appendChild(createPostCard(pub));
    });
}

function createPostCard(pub) {
    const div = document.createElement('div');
    div.className = 'post-card';

    // Media
    let mediaHtml = '';
    if (pub.Media && pub.Media.length > 0) {
        // Display carousel or simple stack. Let's do a horizontal scroll for multiple.
        if (pub.Media.length > 1) {
            mediaHtml = `<div class="post-media-container" style="overflow-x: auto; justify-content: flex-start;">`;
            pub.Media.forEach(m => {
                let src = m.Url;
                if (src.startsWith('/static/uploads/')) {
                    // We hope these exist or use error handler
                }
                if (m.TipoMedia === 'Video' || src.endsWith('.mp4')) {
                    mediaHtml += `<video src="${src}" controls style="min-width:100%; height:100%; object-fit:contain;"></video>`;
                } else {
                    mediaHtml += `<img src="${src}" class="post-img" style="min-width:100%; object-fit:cover;">`;
                }
            });
            mediaHtml += `</div>`;
        } else {
            const m = pub.Media[0];
            let src = m.Url;
            if (m.TipoMedia === 'Video' || src.endsWith('.mp4')) {
                mediaHtml = `<div class="post-media-container"><video src="${src}" controls style="max-height:500px; width:100%;"></video></div>`;
            } else {
                mediaHtml = `<div class="post-media-container"><img src="${src}" class="post-img" onerror="this.style.display='none'"></div>`;
            }
        }
    }

    const dateStr = new Date(pub.FechaPublicacion).toLocaleString();

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
            ${pub.Contenido || ''}
        </div>
        ${mediaHtml}
        <div class="post-footer">
            <div class="post-stats">
                <span>${pub.Likes || 0} Likes</span>
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
        renderPublicFeed();
    });
}

function setupCreatePost() {
    const btn = document.getElementById('btn-publish');
    const contentInput = document.getElementById('new-post-content');
    const fileInput = document.getElementById('post-file-input');
    const previewContainer = document.getElementById('media-preview');

    if (!btn) return; // Not logged in

    // Preview Logic
    fileInput.addEventListener('change', (e) => {
        previewContainer.innerHTML = '';
        Array.from(e.target.files).forEach(file => {
            const url = URL.createObjectURL(file);
            let el;
            if (file.type.startsWith('video')) {
                el = document.createElement('video');
                el.src = url;
            } else {
                el = document.createElement('img');
                el.src = url;
            }
            el.style.height = '60px';
            el.style.width = '60px';
            el.style.objectFit = 'cover';
            el.style.borderRadius = '4px';
            previewContainer.appendChild(el);
        });
    });

    btn.addEventListener('click', async () => {
        const content = contentInput.value;
        const files = fileInput.files;

        if (!content.trim() && files.length === 0) {
            alert("Escribe algo o sube una imagen.");
            return;
        }

        const formData = new FormData();
        formData.append('contenido', content);
        for (let i = 0; i < files.length; i++) {
            formData.append('media', files[i]);
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="zmdi zmdi-spinner zmdi-hc-spin"></i> ...';

        try {
            const response = await fetch('/api/publicaciones/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                // Clear form
                contentInput.value = '';
                fileInput.value = '';
                previewContainer.innerHTML = '';
                alert("Publicado correctamente!");
                // Reload feed
                loadFeed();
            } else {
                alert("Error: " + (data.message || 'No se pudo publicar'));
            }

        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Publicar';
        }
    });
}
