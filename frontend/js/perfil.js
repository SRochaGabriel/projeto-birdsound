const userForm = document.querySelector('#user-form');
const editBtn = document.querySelector('#editar');
const deleteBtn = document.querySelector('#deletar');
const saveBtn = document.querySelector('#salvar');
const cancelBtn = document.querySelector('#cancelar');

window.onload = getUser();

// ao clique do botão 'editar'
editBtn.addEventListener('click', e => {
    e.preventDefault();

    // permite a edição de dados dos inputs
    document.querySelectorAll('input').forEach(input => {
        input.disabled = false;
    });

    // esconde os botões de edição e deleção, mostra apenas 'salvar' e 'cancelar'
    editBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    saveBtn.style.display = 'block';
    cancelBtn.style.display = 'block';
});

// ao clique do botão cancelar
cancelBtn.addEventListener('click', () => {
    // desabilita inputs
    document.querySelectorAll('input').forEach(input => {
        input.disabled = true;
    })

    // esconde os botões de 'salvar' e 'cancelar', mostra apenas edição e deleção
    editBtn.style.display = 'block';
    deleteBtn.style.display = 'block';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
});

// ao clique do botão salvar, ou seja, submit do formulário de atualização
userForm.addEventListener('submit', async e => {
    e.preventDefault();

    // caso o botão clicado tenha sido 'salvar'
    if (e.submitter.id === 'salvar') {
        const formData = new FormData(e.target);
    
        const userData = Object.fromEntries(formData.entries());

        updateUser(userData);
    } else if (e.submitter.id === 'deletar') { // caso o botão clicado tenha sido 'apagar conta'
        deleteUser();
    } else if (e.submitter.id === 'logout') { // caso o botão clicado tenha sido de 'sair'
        localStorage.clear();
        window.location.href = '../login.html';
    }
})

// atualiza o usuário
async function updateUser(userData) {
    try {
        await axios.put('http://localhost:8000/atualizar', userData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtoken')}`
            }
        });
        window.location.reload();
    } catch (err) {
        alert(err.response.data.message);
    }
}

// deleta o usuário
async function deleteUser() {
    try {
        await axios.delete('http://localhost:8000/deleteaccount', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtoken')}`
            }
        });

        localStorage.clear();
        window.location.href = '../login.html';
    } catch (err) {
        alert(err.response.data.message);
    }
}

// busca as infos do usuário
async function getUser() {
    try {
        const response = await axios.get('http://localhost:8000/user', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtoken')}`
            }
        });
        // exibe as informações nos inputs
        document.querySelector('#cpf').defaultValue = response.data.cpf;
        document.querySelector('#nome').defaultValue = response.data.nome;
        document.querySelector('#email').defaultValue = response.data.email;
        document.querySelector('#tel').defaultValue = response.data.telefone;
    } catch (err) {
        console.log(err)
    }
}