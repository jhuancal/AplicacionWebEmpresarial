import "./components/header.js";
import "./components/footer.js";
import "./components/login.js";
import { productsView, initProducts } from "./views/products.js";
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
    "/servicios": "<h1>Servicios</h1><p>Próximamente: Baño, Peluquería y Veterinaria.</p>",
    "/publicaciones": "<h1>Publicaciones</h1><p>Blog y Novedades.</p>"
};
function navigate(path) {
    const content = document.getElementById("content");
    const view = routes[path] || routes["/"];

    content.innerHTML = view;
    if (path === '/productos') {
        initProducts();
    }
    window.scrollTo(0, 0);
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