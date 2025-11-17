// importações
import axios from 'axios';

const toggleMenu = document.querySelector('#menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

// Lógica para exibir/esconder a navbar
toggleMenu.addEventListener('click', () => {
    navLinksContainer.classList.toggle('aberto');
    toggleMenu.classList.toggle('aberto');
});

// verificando se usuário está logado
isLogged();

// função de verificação do status de login do usuário
async function isLogged() {
    const response = await axios.get('http://localhost:8000/usuario/auth', {headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtoken')}`
    }})

    console.log(response)
}