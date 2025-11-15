const toggleMenu = document.querySelector('#menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

// Lógica para exibir/esconder a navbar
toggleMenu.addEventListener('click', () => {
    navLinksContainer.classList.toggle('aberto');
    toggleMenu.classList.toggle('aberto');
});