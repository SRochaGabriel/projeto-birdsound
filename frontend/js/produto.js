window.onload = getProduto(localStorage.getItem('produtoId'));
localStorage.removeItem('produtoId');

// Pegar o produto específico
function getProduto(id) {
    fetch('../data/prod.json')
    .then(res => res.json())
    .then(produtos => {
        let produto;

        // renderizar outros produtos na parte de baixo da tela
        renderProdutos(produtos);

        // busca apenas o produto com o id passado
        produtos.forEach(item => {
            if (item.id == id) {
                produto = item;
            }           
        });

        const valor = produto.valor.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        const valorParcelas = (produto.valor / produto.parcelas).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

        document.querySelector('#produto-display').innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}"/>

            <div id="info">
                <div>
                    <p id="categoria-tipo">${produto.categoria} | ${produto.tipo}</p>
                    <h2>${produto.nome}</h2>
                    <p>Fabricante: <span>${produto.fabricante}</span></p>
                </div>

                <div>
                    <h2 id="valor">${valor}</h2>
                    <p>em ${produto.parcelas}x de ${valorParcelas} sem juros</p>
                </div>

                <button class="main-btn">Adicionar ao carrinho</button>
            </div>
        `;
    })
    .catch(err => console.log(`Erro: ${err}`));
}

// renderiza outros produtos
function renderProdutos(produtos) {
    let prodList = [];

    // preenche prodList com 5 produtos aleatórios buscados de 'produtos'
    while(prodList.length < 5) {
        randomIndex = Math.floor(Math.random() * produtos.length);

        if (!prodList.includes(produtos[randomIndex])) {
            prodList.push(produtos[randomIndex]);
        }
    }

    // exibe os produtos
    prodList.forEach(produto => {
        const valor = produto.valor.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        const valorParcelas = (produto.valor / produto.parcelas).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

        document.querySelector('#outros-produtos').innerHTML += `
            <div class="item-produto">
                <img src="${produto.imagem}" alt="${produto.nome}"/>
                <div class="produto-info">
                    <a class="title-link"href="produto.html" data-id="${produto.id}">${produto.nome}</a>
                    <p class="valor">${valor}</>
                    <p class="parcela-info">em ${produto.parcelas}x de ${valorParcelas} sem juros</p>
                </div>
                <button class="main-btn">Adicionar ao carrinho</button>
            </div>
        `;
    });

    // todo nome do produto é um link que, ao ser clicado, salva o id do produto no localstorage antes de ir para a página
    document.querySelectorAll('.title-link').forEach(link => {
        link.addEventListener('click', e => {
            localStorage.setItem('produtoId', link.dataset.id);
        });
    });
}