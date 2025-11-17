const iconSenha = document.querySelector('.show-hide-password');
const inputSenha = document.querySelector('#senha');
const inputCpfCnpj = document.querySelector('#cpf');
const inputTel = document.querySelector('#tel');
const cadastroForm = document.querySelector('#cadastro-form');

// Cadastrando usuário
cadastroForm.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const userData = Object.fromEntries(formData.entries());

    try {
        const response = await axios.post('http://localhost:8000/cadastro', userData);

        // salvando token no localStorage
        localStorage.setItem('jwtoken', response.data.token);
        
        window.location.href = '../index.html';
    } catch (err) {
        console.log(err)
        alert(err.response.data.message);
    }
});

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

// Lógica de aplicar máscara no input de Telefone
inputTel.addEventListener('input', () => {
    // Limpa do input qualquer coisa que não seja dígito
    inputTel.value = inputTel.value.replace(/\D/g, '');

    // Transforma o formato
    inputTel.value = inputTel.value.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
});

// Lógica de aplicar máscara no input de CPF/CNPJ
inputCpfCnpj.addEventListener('input', () => {
    // Limpa do input qualquer coisa que não seja dígito
    inputCpfCnpj.value = inputCpfCnpj.value.replace(/\D/g, '');

    // aplica a máscara
    inputCpfCnpj.value = mascaraCPF(inputCpfCnpj.value);
});

// Realiza a formatação do valor de CPF
function mascaraCPF(valor) {
    // Usa a função replace capturando grupos do valor com uma regular expression e depois retorna no formato 'xxx.xxx.xxx-xx'
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
}