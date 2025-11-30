const produtosArea = document.querySelector('#produtos-area');
const pedidoArea = document.querySelector('#compra-info');
let listaItens;

window.onload = getProdutos();

// busca os produtos do localStorage
function getProdutos() {
    listaItens = '';
    produtosArea.innerHTML = '';

    const produtos = JSON.parse(localStorage.getItem('carrinho'));

    if (!produtos) {
        return pedidoArea.innerHTML = '<h3>Seu carrinho ainda está vazio!</h3>';
    }

    produtos.forEach(produto => {
        listaItens += `- *${produto.nome}* | *ID: ${produto.codigo}* | *Quantidade: ${produto.quantidade}*  
`;

        const valor = produto.valor.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

        produtosArea.innerHTML += `
            <div class="produto-item">
                <img src="${produto.imagem}"/>

                <div class="produto-info">
                    <a class="title-link" href="produto.html" data-id="${produto.id}">${produto.nome}</a>

                    <p class="valor">${valor}</p>

                    <div class="info-quantidade">
                        <button class="reduce-btn" data-id="${produto.id}">-</button>
                        <p>${produto.quantidade}</p>
                        <button class="add-btn" data-id="${produto.id}">+</button>

                        <button class="excluir-btn" data-id="${produto.id}">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    // todo nome do produto é um link que, ao ser clicado, salva o id do produto no localstorage antes de ir para a página
    document.querySelectorAll('.title-link').forEach(link => {
        link.addEventListener('click', () => {
            localStorage.setItem('produtoId', link.dataset.id);
        });
    });

    // cada botão de excluir chama a função de exclusão
    document.querySelectorAll('.excluir-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            excluirItem(produtos, btn.dataset.id);
        });
    });

    // botões de + adicionam a quantidade do produto
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            addQuantidade(produtos, btn.dataset.id);
        });
    });

    // botões de - subtraem a quantidade do produto
    document.querySelectorAll('.reduce-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            reduzQuantidade(produtos, btn.dataset.id);
        });
    });

    // renderiza a parte com as informações finais do pedido
    renderFinal(produtos);
}

// aumenta a quantidade de um item no pedido
function addQuantidade(produtos, id) {
    produtos.forEach(produto => {
        if (produto.id == id) {
            produto.quantidade++;
        }
    });

    localStorage.setItem('carrinho', JSON.stringify(produtos));
    getProdutos();
}

// reduz a quantidade de um item no pedido
function reduzQuantidade(produtos, id) {
    let produtoEspecifico;

    produtos.forEach(produto => {
        if (produto.id == id) {
            produtoEspecifico = produto;
            produto.quantidade--;
        }
    });

    if (produtoEspecifico.quantidade < 1) {
        excluirItem(produtos, id);
    } else {
        localStorage.setItem('carrinho', JSON.stringify(produtos));
        getProdutos();
    }
}

// exclui um item do carrinho
function excluirItem(produtos, id) {
    const newProdutos = produtos.filter(produto => produto.id != id);

    if (newProdutos.length === 0) {
        localStorage.removeItem('carrinho');
    } else {
        localStorage.setItem('carrinho', JSON.stringify(newProdutos));
    }
    
    window.location.reload();
}

// exibe valor final, opções de parcela e botão de finalizar compra
function renderFinal(produtos) {
    // soma todos os valores em 'produtos'
    const valorFinal = produtos.reduce((acumulador, atual) => acumulador + (atual.valor * atual.quantidade), 0);
    const divisValor = Math.floor(valorFinal / 100) === 0 ? 1 : Math.floor(valorFinal / 100) ;
    const parcelas = (divisValor > 8 ? 8 : divisValor);

    // Compõe a área de finalizar pedido
    pedidoArea.innerHTML = `
        <div>
            <h2>Valor final da compra</h2>
            <h2 class="valor">${valorFinal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</h2>
            <select id="parcelas"></select>
        </div>
        
        <button class="main-btn">
            <i class="fa-brands fa-whatsapp"></i>
            <p>Enviar informações do pedido</p>
        </button>
    `;

    // Gera as opções de parcela que o usuário pode selecionar
    for (let i = 1; i <= parcelas; i++) {
        const valorParcelas = (valorFinal / i).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

        document.querySelector('#parcelas').innerHTML += `
            <option value="${i}x de ${valorParcelas} sem juros">em ${i}x de ${valorParcelas} sem juros</option>
        `;
    }

    // Ao clique do botão de enviar o pedido, compõe a mensagem personalizada (manter essa formatação) e usa o link de api do whatsapp para enviar a mensagem para a loja
    document.querySelector('#compra-info button').addEventListener('click', () => {
        
        const mensagemPersonalizada = `Olá, gostaria de registrar meu pedido e iniciar o atendimento!  
Produtos:  
${listaItens}Valor:  
- *${valorFinal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}*  
Parcelamento:  
- *${document.querySelector('#parcelas').value}*`;

        window.open(`https://api.whatsapp.com/send?phone=5511988571147&text=${encodeURIComponent(mensagemPersonalizada)}`, "_blank");
    });
}