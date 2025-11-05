const iconSenha = document.querySelector('.show-hide-password');
const inputSenha = document.querySelector('#senha');
const inputCpfCnpj = document.querySelector('#cpf-cnpj');
const inputTel = document.querySelector('#tel');

// Lógica para esconder/exibir senha
iconSenha.addEventListener('click', () => {
    // Se o tipo do input for password, altera para text e troca o ícone
    if (inputSenha.type === 'password') {
        inputSenha.type = 'text';
        iconSenha.classList.remove('fa-eye');
        iconSenha.classList.add('fa-eye-slash');
    } else { // Caso contrário, altera para password e troca o ícone
        inputSenha.type = 'password';
        iconSenha.classList.remove('fa-eye-slash');
        iconSenha.classList.add('fa-eye');
    }
});

// Lógica de aplicar máscara no input de Telefone
inputTel.addEventListener('input', () => {
    // Limpa do input qualquer coisa que não seja dígito
    inputTel.value = inputTel.value.replace(/\D/g, '');

    inputTel.value = inputTel.value.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
});

// Lógica de aplicar máscara no input de CPF/CNPJ
inputCpfCnpj.addEventListener('input', () => {
    // Limpa do input qualquer coisa que não seja dígito
    inputCpfCnpj.value = inputCpfCnpj.value.replace(/\D/g, '');

    // Caso o tamanho do conteúdo digitado no input seja menor ou igual a 11, usa a máscara de CPF
    if (inputCpfCnpj.value.length <= 11) {
        inputCpfCnpj.value = mascaraCPF(inputCpfCnpj.value);
    } else { // Caso o tamanho do conteúdo seja maior que 11, usa a máscara de CNPJ
        inputCpfCnpj.value = mascaraCNPJ(inputCpfCnpj.value);
    }
});

// Definindo a função que realiza a formatação do valor de CPF
function mascaraCPF(valor) {
    // Usa a função replace capturando grupos do valor com uma regular expression e depois retorna no formato 'xxx.xxx.xxx-xx'
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
}

// Definindo a função que realiza a formatação do valor de CNPJ
function mascaraCNPJ(valor) {
    return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
}