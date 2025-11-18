const recoverForm = document.querySelector('#recover-form');
const sendBtn = document.querySelector('#enviar');
const savePassBtn = document.querySelector('#alterar');
const resetBtn = document.querySelector('#reset');
const emailInput = document.querySelector('#email');
const codigoInput = document.querySelector('#codigo');
const senhaInput = document.querySelector('#senha');

// Envio de código para o e-mail
recoverForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const info = Object.fromEntries(formData.entries());

    // caso o usuário tenha clicado no botão de enviar o código para o email
    if (e.submitter.id === 'enviar') {
        sendCodeToEmail(info);
    } else if (e.submitter.id === 'alterar') { // caso o usuário tenha clicado no botão de alterar a senha
        resetPassword(info);
    }
});

// impedindo o formulário de ser enviado com 'enter' para evitar conflito com os dois botões de submit
recoverForm.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});

// Restaurar o estilo da página
resetBtn.addEventListener('click', () => {
    updateFormStyle(false);
    codigoInput.value = '';
    senhaInput.value = '';
    emailInput.focus();
});

// Função que tenta redefinir a senha
async function resetPassword(info) {
    try {
        const response = await axios.put('http://localhost:8000/resetpass', info, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('recCode')}`
            }
        });

        alert(response.data.message);
        window.location.href = '../login.html';
    } catch (err) {
        alert(err.response.data.message);
    }
}

// Função que envia o código para o email
async function sendCodeToEmail(info) {
    try {
        emailInput.value = 'Enviando...';
        const response = await axios.post('http://localhost:8000/sendcode', info);

        alert(response.data.message);

        localStorage.setItem('recCode', response.data.token);

        updateFormStyle(true);
        codigoInput.focus();
    } catch (err) {
        alert(err.response.data.message);
        emailInput.value = '';
    }
}

// altera o formulário
function updateFormStyle(modo) {
    if (modo === true) {
        // limpa e desabilita input de email
        document.querySelector('.email-box').style.color = '#aaa';
        emailInput.disabled = true;
        emailInput.value = '';

        // esconde botão de enviar e mostra o de alterar senha
        sendBtn.style.display = 'none';
        savePassBtn.style.display = 'block';

        // habilita os inputs de codigo e senha
        document.querySelectorAll('.cod-pass-box').forEach(input => input.style.color = '#000');
        codigoInput.disabled = false;
        senhaInput.disabled = false;
    } else {
        // habilita input de email
        document.querySelector('.email-box').style.color = '#000';
        emailInput.disabled = false;

        // esconde botão de alterar senha e mostra o de enviar codigo
        sendBtn.style.display = 'block';
        savePassBtn.style.display = 'none';

        // desabilita os inputs de codigo e senha
        document.querySelectorAll('.cod-pass-box').forEach(input => input.style.color = '#aaa');
        codigoInput.disabled = true;
        senhaInput.disabled = true;
    }
}