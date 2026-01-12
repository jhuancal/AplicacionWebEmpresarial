document.addEventListener('DOMContentLoaded', () => {

    const getImages = container => [...container.querySelectorAll('img')]
    const getLargeImages = gallery => gallery.map(el => el.src).map(el => el.replace('thumb', 'big'))


    const openLightboxEvent = (container, gallery, larges) => {
        container.addEventListener('click', e => {
            let el = e.target,
                i = gallery.indexOf(el)

            if (el.tagName == 'IMG') {
                openLightbox(gallery, i, larges)
            }

        })
    }

    const openLightbox = (gallery, i, larges) => {
        let lightboxElement = document.createElement('div')
        lightboxElement.innerHTML = `
        <div class="lightbox-overlay">
        <div class="close-modal"><i class="zmdi zmdi-close"></i></div>
            <figure class="lightbox-container">
                <img src="${larges[i]}" class="lightbox-image">
                <figcaption>
                <nav class="navigation">
                <a href="#" class="lightbox-navigation prev"><i class="zmdi zmdi-chevron-left"></i></i></a>
                <a href="#" class="lightbox-navigation next"><i class="zmdi zmdi-chevron-right"></i></a>
                </nav>
                </figcaption>
            </figure>
        </div>
        `

        lightboxElement.id = 'lightbox'
        document.body.appendChild(lightboxElement)
        closeModal(lightboxElement)
        navigateLightbox(lightboxElement, i, larges)

    }

    const closeModal = modalElement => {
        let closeModal = modalElement.querySelector('.close-modal')
        closeModal.addEventListener('click', e => {
            e.preventDefault()
            document.body.removeChild(modalElement)
        })
    }

    const navigateLightbox = (lightboxElement, i, larges) => {
        let prevButton = lightboxElement.querySelector('.prev'),
            nextButton = lightboxElement.querySelector('.next'),
            image = lightboxElement.querySelector('img'),
            closeButton = lightboxElement.querySelector('.close-modal')

        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowRight') {
                nextButton.click()
            }
            if (e.key === 'ArrowLeft') {
                prevButton.click()
            }
            if (e.key === 'Escape') {
                closeButton.click()
            }
        })

        lightboxElement.addEventListener('click', e => {
            e.preventDefault()
            let target = e.target
            if (target === prevButton) {
                if (i > 0) {
                    image.src = larges[i - 1]
                    i--
                } else {
                    image.src = larges[larges.length - 1]
                    i = larges.length - 1
                }
            } else if (target === nextButton) {
                if (i < larges.length - 1) {
                    image.src = larges[i + 1]
                    i++
                } else {
                    image.src = larges[0]
                    i = 0
                }
            }
        })
    }

    const lightbox = container => {
        let images = getImages(container),
            larges = getLargeImages(images)
        openLightboxEvent(container, images, larges)
    }

    function setupLoginModal() {
        const loginTrigger = document.getElementById('login-trigger');
        const modal = document.getElementById('login-modal');

        if (!loginTrigger || !modal) return;

        const closeBtn = modal.querySelector('.modal-close');
        const form = document.getElementById('login-form');

        loginTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('open');
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('open');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('login-username'); // Changing ID logic to match HTML if needed, but HTML has login-username

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            if (!username || !password) {
                alert('Por favor complete todos los campos.');
                return;
            }

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: username, password: password })
                });

                const data = await response.json();

                if (data.success) {
                    window.location.reload();
                } else {
                    alert(data.message || 'Error al iniciar sesión');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Ocurrió un error al intentar conectarse con el servidor.');
            }
        });
    }

    var scroll = new SmoothScroll('a[href*="#"]', {
        speed: 1000
    });

    setupLoginModal();
})

let indice = 1;
if (document.getElementsByClassName('miSlider').length > 0) {
    muestraSlides(indice);

    setInterval(function tiempo() {
        muestraSlides(indice += 1)
    }, 10000);
}

function avanzaSlide(n) {
    muestraSlides(indice += n);
}

function posicionSlide(n) {
    muestraSlides(indice = n);
}

function muestraSlides(n) {
    let i;
    let slides = document.getElementsByClassName('miSlider');
    let barras = document.getElementsByClassName('dot');

    if (slides.length === 0) return;

    if (n > slides.length) {
        indice = 1;
    }
    if (n < 1) {
        indice = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    for (i = 0; i < barras.length; i++) {
        barras[i].className = barras[i].className.replace(" active", "");
    }

    if (slides[indice - 1]) {
        slides[indice - 1].style.display = 'block';
    }
    if (barras[indice - 1]) {
        barras[indice - 1].className += ' active';
    }

}

const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show')
        })

        nav.addEventListener('click', e => {
            let el = e.target
            if (el.tagName == 'A') {
                nav.classList.toggle('show')
            }
        })
    }

}

showMenu('navbar-menu-mobile', 'navbar-container')