const produtosArea = document.querySelector('#produtos-grid');
const paginacaoArea = document.querySelector('#paginacao');
const filtroForm = document.querySelector('#filtros form');
const categSelect = document.querySelector('#filtros form #categoria');
const tipoSelect = document.querySelector('#filtros form #tipo');
const fabricanteSelect = document.querySelector('#filtros form #fabricante');
let pagina = 1;
let totalPaginas;
let produtos;
let valoresFiltro;

window.onload = getProdutos();

// ao submeter o form de filtro
filtroForm.addEventListener('submit', e => {
    e.preventDefault();

    // Buscando as informações do form, transformando em objeto e, por fim, em uma url em formato de parametros
    const formData = new FormData(e.target);
    const filtro = Object.fromEntries(formData.entries());
    const urlParams = new URLSearchParams(filtro).toString();

    getProdutos(urlParams);
});

// função que busca os produtos
async function getProdutos(filtro) {
    produtosArea.innerHTML = '';
    paginacaoArea.innerHTML = '';
    categSelect.innerHTML = '<option value="" disabled selected>Filtrar por categoria</option>';
    tipoSelect.innerHTML = '<option value="" disabled selected>Filtrar pelo tipo de produto</option>';
    fabricanteSelect.innerHTML = '<option value="" disabled selected>Filtrar pelo fabricante</option>';

    let response;

    if (!filtro) {
        try {
            response = await axios.get(`http://localhost:8000/produtos/${pagina}`);
        } catch (err) {
            produtosArea.innerHTML = `<h1>${err.response.data.message}</h1>`;
        }
    } else {
        response = await axios.get(`http://localhost:8000/produtos/${pagina}?${filtro}`);
    }

    produtos = response.data.produtos;
    totalPaginas = response.data.paginas;
    valoresFiltro = response.data.filtros;
    
    produtos.forEach(produto => {
        const valor = produto.valor.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        const valorParcela = (produto.valor / produto.parcelas).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

        produtosArea.innerHTML += `
            <div class="item-produto">
                <img src="${produto.imagem}"/>

                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p class="valor">${valor}</p>
                    <p class="parcela-info">em ${produto.parcelas}x de ${valorParcela} sem juros</p>
                </div>

                <button class="main-btn">Comprar</button>
            </div>
        `;
    });

    gerarOpcoesFiltro(valoresFiltro);
    mostrarPaginacao(totalPaginas);
}

// Exibe a barra de páginas com base na informação do total de páginas enviadas pelo servidor
function mostrarPaginacao(totalPaginas) {
    paginacaoArea.innerHTML = `
        <button onclick=atualizaPagina(${pagina-1}) ${pagina === 1 ? 'disabled' : ''}>
            <i class="fa-solid fa-angle-left"></i>
        </button>
    `;

    for (let i = 1; i <= totalPaginas; i++) {
        paginacaoArea.innerHTML += `<button onclick="atualizaPagina(${i})">${i}</button>`;
    }

    paginacaoArea.innerHTML += `
        <button onclick=atualizaPagina(${pagina+1}) ${pagina === totalPaginas ? 'disabled' : ''}>
            <i class="fa-solid fa-angle-right"></i>
        </button>
    `;
}

// Função que permite a busca de outras páginas
function atualizaPagina(novaPag) {
    pagina = novaPag;
    paginacaoArea.innerHTML = '';
    produtosArea.innerHTML = '';
    getProdutos();
}

// Função que atualiza as opções de filtro que o usuário tem
function gerarOpcoesFiltro(valores) {
    valores.categoria.forEach(categoria => {
        categSelect.innerHTML += `<option value="${categoria}">${categoria}</option>`;
    });

    valores.tipo.forEach(tipo => {
        tipoSelect.innerHTML += `<option value="${tipo}">${tipo}</option>`;
    });

    valores.fabricante.forEach(fabricante => {
        fabricanteSelect.innerHTML += `<option value="${fabricante}">${fabricante}</option>`;
    });
}