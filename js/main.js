const toggleMenu = document.querySelector('#menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

// Lógica para exibir/esconder a navbar
toggleMenu.addEventListener('click', () => {
    navLinksContainer.classList.toggle('aberto');
    toggleMenu.classList.toggle('aberto');
});

// chama a função que verifica o carrinho
window.onload = checaCarrinho();

// renderiza os produtos na página
export function renderProdutos(produtos, produtosArea) {
    produtosArea.innerHTML = '';

    produtos.forEach(produto => {
        const valor = produto.valor.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        const valorParcela = (produto.valor / produto.parcelas).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        produtosArea.innerHTML += `
            <div class="item-produto">
                <a class="title-link" href="produto.html" data-id="${produto.id}">
                    <img src="${produto.imagem}" alt="${produto.nome}"/>
                </a>

                <div class="produto-info">
                    <a class="title-link" href="produto.html" data-id="${produto.id}">${produto.nome}</a>
                    <p class="valor">${valor}</>
                    <p class="parcela-info">em ${produto.parcelas}x de ${valorParcela} sem juros</p>
                </div>

                <button class="main-btn" data-id="${produto.id}">Adicionar ao carrinho</button>
            </div>
        `;
    });

    // adicionando um item ao carrinho ao clicar no botão
    document.querySelectorAll('.item-produto button').forEach(carrinhoBtn => {
        carrinhoBtn.addEventListener('click', () => addCart(produtos, carrinhoBtn.dataset.id));
    });

    // todo nome do produto é um link que, ao ser clicado, salva o id do produto no localstorage antes de ir para a página
    document.querySelectorAll('.title-link').forEach(link => {
        link.addEventListener('click', e => {
            localStorage.setItem('produtoId', link.dataset.id);
        });
    });
}

// função que adiciona item ao carrinho
export function addCart(produtos, id) {
    const prodItem = produtos.filter(produto => produto.id == id);
    prodItem[0].quantidade = 1;

    // caso o localStorage esteja vazio
    if (!localStorage.getItem('carrinho')) {
        localStorage.setItem('carrinho', JSON.stringify(prodItem));
    } else { // caso já tenha itens
        let cartItems = JSON.parse(localStorage.getItem('carrinho'));
        
        // só adiciona novo item ao carrinho caso o item clicado ainda não esteja adicionado
        if (!cartItems.some(item => item.id == prodItem[0].id)) {
            cartItems.push(prodItem[0]);
        }
        
        localStorage.setItem('carrinho', JSON.stringify(cartItems));
    }
    
    mostraToast();
    checaCarrinho();
}

// função que exibe toast ao adicionar item ao carrinho
function mostraToast() {
    const toast = document.querySelector('#toast');

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show')
    }, 2500);
}

// verifica quantos itens tem no carrinho e exibe esse número na barra de navegação ao lado do link da página carrinho
export function checaCarrinho() {
    if (localStorage.getItem('carrinho')) {
        document.querySelector('.nav-links #carrinho-link p').innerHTML = JSON.parse(localStorage.getItem('carrinho')).length;
    }
}