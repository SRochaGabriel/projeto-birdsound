const iconSenha = document.querySelector('.show-hide-password');
const inputSenha = document.querySelector('#senha');

// Lógica para esconder/exibir senha
iconSenha.addEventListener('click', () => {
    if (inputSenha.type === 'password') {
        inputSenha.type = 'text';
        iconSenha.classList.remove('fa-eye');
        iconSenha.classList.add('fa-eye-slash');
    } else {
        inputSenha.type = 'password';
        iconSenha.classList.remove('fa-eye-slash');
        iconSenha.classList.add('fa-eye');
    }
});