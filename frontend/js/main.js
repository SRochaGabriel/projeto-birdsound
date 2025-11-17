const toggleMenu = document.querySelector('#menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

// Lógica para exibir/esconder a navbar
toggleMenu.addEventListener('click', () => {
    navLinksContainer.classList.toggle('aberto');
    toggleMenu.classList.toggle('aberto');
});

// chama a função de autenticação ao carregar a página
window.onload = authUser();

// função que verifica se o usuário está autenticado
async function authUser() {
    try {
        await axios.get('http://localhost:8000/usuario/auth', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtoken')}`
            }
        });

        updateUI(true);
    } catch (err) {
        updateUI(false);
    }
}

// função que altera o visual da página de acordo com o status de login
function updateUI(isLogged) {
    const navLink = document.querySelector('#login-profile');

    if (isLogged) {
        navLink.innerHTML = '<i class="fa-solid fa-user"></i>';
        navLink.href = './perfil.html';
    } else {
        navLink.innerHTML = 'Entrar';
        navLink.href = './login.html';
    }
}