import { renderProdutos, addCart } from "./main.js";

const produtosArea = document.querySelector('#outros-produtos');

window.onload = getProduto(localStorage.getItem('produtoId'));

// Pegar o produto específico
function getProduto(id) {
    fetch('./data/prod.json')
    .then(res => res.json())
    .then(produtos => {
        let produto;

        // preenche prodList com 5 produtos aleatórios buscados de 'produtos'
        let prodList = [];
        while(prodList.length < 5) {
            const randomIndex = Math.floor(Math.random() * produtos.length);

            if (!prodList.includes(produtos[randomIndex])) {
                prodList.push(produtos[randomIndex]);
            }
        }

        // renderizar outros produtos na parte de baixo da tela
        renderProdutos(prodList, produtosArea);

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
                
                <p>
                    ${produto.desc}
                </p>

                <div>
                    <h2 id="valor">${valor}</h2>
                    <p>em ${produto.parcelas}x de ${valorParcelas} sem juros</p>
                </div>

                <button class="main-btn" id="add-cart">Adicionar ao carrinho</button>
            </div>
        `;

        document.querySelector('#add-cart').addEventListener('click', () => addCart(produtos, produto.id));
    });
}