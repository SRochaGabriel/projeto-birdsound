const produtosArea = document.querySelector('#produtos-grid');
const paginacaoArea = document.querySelector('#paginacao');
const filtroForm = document.querySelector('#filtros form');
const categSelect = document.querySelector('#filtros form #categoria');
const tipoSelect = document.querySelector('#filtros form #tipo');
const fabricanteSelect = document.querySelector('#filtros form #fabricante');
const limiteItens = 15;
let opcoesFiltro;
let pagina = 1;
let totalPaginas;
let valoresFiltro;

window.onload = getProdutos();

// submit dos filtros
filtroForm.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const filtros = Object.fromEntries(formData.entries());

    getProdutos(filtros);
});

// função que busca os produtos do JSON
function getProdutos(filtros) {
    fetch('../data/prod.json', {method: 'GET'})
    .then(res => res.json())
    .then(produtos => {
        // definindo quais valores de filtro podem ser usados entre 'tipo', 'categoria' e 'fabricante'
        opcoesFiltro = {
            tipo: [...new Set(produtos.map(produto => produto.tipo))],
            categoria: [...new Set(produtos.map(produto => produto.categoria))],
            fabricante: [...new Set(produtos.map(produto => produto.fabricante))]
        };

        // recebe lista dos produtos retornados
        let prodList = produtos;

        // caso hajam filtros, prodList recebe os valores já filtrados
        if (filtros) {
            prodList = filtrarProdutos(produtos, filtros);
        }

        if (prodList.length == 0) {
            return produtosArea.innerHTML = '<h3>Não foi possível encontrar nenhum produto</h3>';
        }

        // calculando o total de páginas
        const totalPaginas = Math.ceil(prodList.length / limiteItens);
        // buscando somente os produtos da página atual
        const produtosPagina = getProdutosPagina(prodList, pagina);

        gerarOpcoesFiltro(opcoesFiltro);
        gerarPaginacao(totalPaginas);

        // caso não tenham filtros de busca, retorna os produtos sem filtragem
        renderProdutos(produtosPagina);
    })
    .catch(err => console.log(`Erro: ${err}`));
}

// renderiza os produtos na página
function renderProdutos(produtos) {
    produtosArea.innerHTML = '';

    produtos.forEach(produto => {
        const valor = produto.valor.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        const valorParcela = (produto.valor / produto.parcelas).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        produtosArea.innerHTML += `
            <div class="item-produto">
                <img src="${produto.imagem}" alt="${produto.nome}"/>

                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p class="valor">${valor}</>
                    <p class="parcela-info">em ${produto.parcelas}x de ${valorParcela} sem juros</p>
                </div>

                <button class="main-btn">Adicionar ao carrinho</button>
            </div>
        `;
    });
}

// função que busca e retorna somente os produtos da página requisitada
function getProdutosPagina(produtos, pagina) {
    const startIndex = (pagina - 1) * limiteItens;
    const endIndex = pagina * limiteItens;

    return produtos.slice(startIndex, endIndex);
}

// função que realiza a filtragem dos produtos e 
function filtrarProdutos(produtos, filtros) {
    return produtos.filter(produto => {
        // para cada filtro, testa se é compatível com o produto para decidir se retorna ele ou não
        for (let item of Object.keys(filtros)) {
            if (produto[item] != filtros[item]) {
                return false;
            }
        }

        return true;
    });
}

// função que calcula o total de páginas com base no limite de itens e exibe a barra de paginação
function gerarPaginacao(totalPaginas) {
    // esvaziando
    paginacaoArea.innerHTML = '';

    // caso não seja a primeira página e a primeira página não apareça na lista, exibe o botão que leva à ela
    if (pagina != 1 && pagina - 1 != 1) {
        paginacaoArea.innerHTML += `<button class="secondary-btn" onclick=atualizaPagina(${totalPaginas - (totalPaginas - 1)})>Primeiro</button>`;
    }

    // botão que retorna uma página
    paginacaoArea.innerHTML += `
        <button class="secondary-btn" onclick=atualizaPagina(${pagina - 1}) ${pagina === 1 ? 'disabled' : ''}>
            <i class="fa-solid fa-angle-left"></i>
        </button>
    `;

    // Se não for a página inicial, exibe um botão com o número da página anterior
    if (pagina != 1) {
        paginacaoArea.innerHTML += `<button class="secondary-btn" onclick=atualizaPagina(${pagina - 1})>${pagina - 1}</button>`;
    }

    // botão da página atual
    paginacaoArea.innerHTML += `<button class="secondary-btn" id="pagina-atual" onclick=atualizaPagina(${pagina})>${pagina}</button>`;

    // se não for a última página, exibe botão com o número da próxima página
    if (pagina != totalPaginas) {
        paginacaoArea.innerHTML += `<button class="secondary-btn" onclick=atualizaPagina(${pagina + 1})>${pagina + 1}</button>`;
    }

    // botão que avança uma página
    paginacaoArea.innerHTML += `
        <button class="secondary-btn" onclick=atualizaPagina(${pagina + 1}) ${pagina === totalPaginas ? 'disabled' : ''}>
            <i class="fa-solid fa-angle-right"></i>
        </button>
    `;

    // se não for a útlima página e a última página não aparecer na lista, exibe o botão que leva até ela
    if (pagina != totalPaginas && pagina + 1 != totalPaginas) {
        paginacaoArea.innerHTML += `<button class="secondary-btn" onclick=atualizaPagina(${totalPaginas})>Último</button>`;
    }
}

// função que atualiza a página
function atualizaPagina(novaPag) {
    pagina = novaPag;
    window.scrollTo(0, 0);
    getProdutos();
}

// função que atualiza as opções de filtro que o usuário tem
function gerarOpcoesFiltro(opcoes) {
    // Gerando valores iniciais dos selects
    tipoSelect.innerHTML = '<option value="" disabled selected>Filtrar pelo tipo de produto</option>';
    categSelect.innerHTML = '<option value="" disabled selected>Filtrar por categoria</option>';
    fabricanteSelect.innerHTML = '<option value="" disabled selected>Filtrar pelo fabricante</option>';


    // Populando os selects com as opções recebidas
    opcoes.tipo.forEach(tipo => {
        tipoSelect.innerHTML += `<option value="${tipo}">${tipo}</option>`;
    });

    opcoes.categoria.forEach(categoria => {
        categSelect.innerHTML += `<option value="${categoria}">${categoria}</option>`;
    });

    opcoes.fabricante.forEach(fabricante => {
        fabricanteSelect.innerHTML += `<option value="${fabricante}">${fabricante}</option>`;
    })
}