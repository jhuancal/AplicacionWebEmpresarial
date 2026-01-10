import "./components/header.js";
import "./components/footer.js";
import "./components/login.js";
import { productsView, initProducts } from "./views/products.js";
import { adoptionView, initAdoption } from "./views/adopcion.js"; // Import new view
import { servicesView, initServices } from "./views/servicios.js";
import { publicationsView, initPublications } from "./views/publicaciones.js";

const routes = {
    "/": `
    <div class="hero" style="text-align: center; padding: 4rem 1rem; background: linear-gradient(135deg, #fceabb 0%, #f8b500 100%); border-radius: 8px; color: #333; margin-bottom: 2rem;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">Bienvenido a SuperPet 🐾</h1>
        <p style="font-size: 1.2rem;">Expertos en nutrición y bienestar para tu mascota.</p>
        <button onclick="window.history.pushState({}, '', '/productos'); window.dispatchEvent(new Event('popstate'));" style="margin-top: 1rem; padding: 10px 20px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">Ver Productos</button>
    </div>
    <div class="featured">
        <h2 style="text-align:center; margin-bottom: 2rem;">Nuestros Favoritos</h2>
        <products-component></products-component>
    </div>
  `,
    "/productos": productsView,
    "/adopcion": adoptionView, // Add route
    "/servicios": servicesView,
    "/publicaciones": publicationsView
};
function navigate(path) {
    resetTheme(); // Reset to default theme on navigation
    const content = document.getElementById("content");
    if (!routes[path]) return; // Use server-rendered content for unknown routes (like /register)
    const view = routes[path];

    content.innerHTML = view;
    if (path === '/productos') {
        initProducts();
    }
    if (path === '/adopcion') {
        initAdoption();
    }
    if (path === '/servicios') {
        initServices();
    }
    if (path === '/servicios') {
        // Set Dark Theme for Services Page
        document.body.style.backgroundColor = "#191919";
        document.body.style.color = "#fff";
        initServices();
    }
    if (path === '/publicaciones') {
        initPublications();
    }
    window.scrollTo(0, 0);
}

function resetTheme() {
    document.body.style.backgroundColor = "#f4f4f4"; // Default light theme
    document.body.style.color = ""; // Reset text color
}

document.addEventListener("DOMContentLoaded", () => {
    navigate(window.location.pathname);
    window.addEventListener("popstate", () => {
        navigate(window.location.pathname);
    });
    document.addEventListener('open-login', () => {
        const loginComponent = document.querySelector('login-component');
        if (loginComponent) loginComponent.open();
    });
});