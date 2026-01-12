
export const publicationsView = `
<style>
    .feed-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px 0;
        font-family: 'Poppins', sans-serif;
    }
    .create-post-card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        margin-bottom: 30px;
    }
    .create-post-card textarea {
        width: 100%;
        border: none;
        resize: none;
        font-size: 1.1em;
        font-family: inherit;
        outline: none;
        margin-bottom: 15px;
        height: 80px;
    }
    .create-post-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #eee;
        padding-top: 15px;
    }
    .upload-btn-wrapper {
        position: relative;
        overflow: hidden;
        display: inline-block;
        cursor: pointer;
        color: #007bff;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    .upload-btn-wrapper input[type=file] {
        font-size: 100px;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
    .post-btn {
        background: #007bff;
        color: white;
        border: none;
        padding: 8px 24px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.2s;
    }
    .post-btn:hover { background: #0056b3; }
    .post-btn:disabled { background: #ccc; cursor: not-allowed; }

    /* Post Styles */
    .post-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        margin-bottom: 20px;
        overflow: hidden;
    }
    .post-header {
        display: flex;
        align-items: center;
        padding: 15px;
    }
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #ddd;
        margin-right: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: #555;
    }
    .user-info h4 { margin: 0; font-size: 1em; color: #333; }
    .user-info span { font-size: 0.8em; color: #999; }
    .post-content {
        padding: 0 15px 15px 15px;
        color: #333;
        line-height: 1.5;
        white-space: pre-wrap;
    }
    .post-media {
        width: 100%;
        background: black;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .post-media img, .post-media video {
        max-width: 100%;
        max-height: 500px;
        object-fit: contain;
    }
    .post-footer {
        padding: 10px 15px;
        border-top: 1px solid #f4f4f4;
        display: flex;
        gap: 20px;
    }
    .action-btn {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.9em;
    }
    .action-btn:hover { color: #007bff; }
    
    .loading-feed { text-align: center; padding: 40px; color: #999; }
</style>

<div class="feed-container">
    <!-- Create Post Section (Only for logged in users) -->
    <div class="create-post-card" id="create-post-section" style="display:none;">
        <textarea id="post-content" placeholder="¿Qué estás pensando?"></textarea>
        <!-- Preview -->
        <div id="media-preview" style="display:flex; gap:10px; margin-bottom:15px; overflow-x:auto;"></div>
        
        <div class="create-post-actions">
            <div class="upload-btn-wrapper">
                <i class="fa fa-image"></i> Foto/Video
                <input type="file" id="post-media" multiple accept="image/*,video/*">
            </div>
            <button class="post-btn" id="submit-post-btn">Publicar</button>
        </div>
    </div>

    <!-- Feed Section -->
    <div id="feed-list">
        <div class="loading-feed"><i class="fa fa-spinner fa-spin"></i> Cargando publicaciones...</div>
    </div>
</div>
`;

export async function initPublications() {
    const feedList = document.getElementById('feed-list');
    const createSection = document.getElementById('create-post-section');
    const submitBtn = document.getElementById('submit-post-btn');
    const mediaInput = document.getElementById('post-media');
    const previewContainer = document.getElementById('media-preview');

    // Check Login
    if (window.USER_SESSION) {
        createSection.style.display = 'block';
    } else {
        // Maybe show a "Login to post" message
    }

    // Load Feed
    loadFeed();

    // Event Listeners
    if (mediaInput) {
        mediaInput.addEventListener('change', (e) => {
            previewContainer.innerHTML = '';
            Array.from(e.target.files).forEach(file => {
                const url = URL.createObjectURL(file);
                let el;
                if (file.type.startsWith('video')) {
                    el = document.createElement('video');
                    el.src = url;
                    el.style.height = '60px';
                } else {
                    el = document.createElement('img');
                    el.src = url;
                    el.style.height = '60px';
                }
                el.style.borderRadius = '4px';
                previewContainer.appendChild(el);
            });
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const content = document.getElementById('post-content').value;
            const files = mediaInput.files;

            if (!content && files.length === 0) return alert("Escribe algo o sube una foto/video.");

            const formData = new FormData();
            formData.append('contenido', content);
            for (let i = 0; i < files.length; i++) {
                formData.append('media', files[i]);
            }

            submitBtn.disabled = true;
            submitBtn.innerText = 'Publicando...';

            try {
                const res = await fetch('/api/publicaciones/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();

                if (data.success) {
                    document.getElementById('post-content').value = '';
                    mediaInput.value = '';
                    previewContainer.innerHTML = '';
                    loadFeed(); // Reload feed
                } else {
                    alert(data.message || 'Error al publicar');
                }
            } catch (e) {
                console.error(e);
                alert("Error de conexión");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Publicar';
            }
        });
    }

    async function loadFeed() {
        try {
            const res = await fetch('/api/publicaciones/feed');
            const posts = await res.json();

            if (posts.length === 0) {
                feedList.innerHTML = '<p style="text-align:center; color:#999;">No hay publicaciones aún. ¡Sé el primero!</p>';
                return;
            }

            feedList.innerHTML = posts.map(renderPost).join('');
        } catch (e) {
            console.error(e);
            feedList.innerHTML = '<p style="text-align:center; color:red;">Error al cargar el feed.</p>';
        }
    }

    function renderPost(post) {
        let mediaHtml = '';
        if (post.Media && post.Media.length > 0) {
            mediaHtml = '<div class="post-media">';
            // Carousel or simple stack? Stack for MVP, or first item.
            // Let's scroll if multiple?
            if (post.Media.length > 1) {
                // simple horizontal scroll container
                mediaHtml = '<div class="post-media" style="overflow-x:auto; justify-content:flex-start; gap:10px; padding:10px;">';
                post.Media.forEach(m => {
                    if (m.TipoMedia === 'Video') {
                        mediaHtml += `<video src="${m.Url}" controls style="max-height:400px; min-width:300px;"></video>`;
                    } else {
                        mediaHtml += `<img src="${m.Url}" style="max-height:400px; min-width:300px;">`;
                    }
                });
                mediaHtml += '</div>';
            } else {
                const m = post.Media[0];
                if (m.TipoMedia === 'Video') {
                    mediaHtml += `<video src="${m.Url}" controls></video>`;
                } else {
                    mediaHtml += `<img src="${m.Url}">`;
                }
                mediaHtml += '</div>';
            }
        }

        const date = new Date(post.FechaPublicacion).toLocaleString();

        return `
            <div class="post-card">
                <div class="post-header">
                    <div class="avatar">${post.Autor[0].toUpperCase()}</div>
                    <div class="user-info">
                        <h4>${post.Autor}</h4>
                        <span>${date}</span>
                    </div>
                </div>
                <div class="post-content">${post.Contenido || ''}</div>
                ${mediaHtml}
                <div class="post-footer">
                    <button class="action-btn"><i class="far fa-heart"></i> ${post.Likes} Me gusta</button>
                    <button class="action-btn"><i class="far fa-comment"></i> Comentar</button>
                    <button class="action-btn"><i class="far fa-share-square"></i> Compartir</button>
                </div>
            </div>
        `;
    }
}
