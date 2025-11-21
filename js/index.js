import { addCart } from "./main.js";

window.onload = getProdutos();

// Código do SplideJS para carousel responsivo
var splide = new Splide( '.splide', {
  type: 'loop',
  perPage: 3,
  gap    : '2rem',
  autoheight: true,
  breakpoints: {
    640: {
      perPage: 2,
      gap    : '.7rem',
    },
    480: {
      perPage: 1,
      gap    : '.7rem',
    },
  },
} );

// função que busca produtos
function getProdutos() {
    fetch('./data/prod.json', {method: 'GET'})
    .then(res => res.json())
    .then(produtos => {
        let prodList = [];

        // Enquanto a length de prodList for menor que 9 (enquanto não tiver 9 itens), gera um index aleatório baseado na lenght de 'produtos' e, caso o item acessado por meio desse index não faça parte de prodList ainda, inclui o item
        while (prodList.length < 9) {
            const randomIndex = Math.floor(Math.random() * produtos.length);

            // Verifica se o item buscado pelo index aleatório já está incluído em prodList, se NÃO estiver, inclui
            if (!prodList.includes(produtos[randomIndex])) {
                prodList.push(produtos[randomIndex]);
            }
        }

        // Gera itens de carousel seguindo o padrão SplideJS
        prodList.forEach(produto => {
            const valor = produto.valor.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
            const valorParcela = (produto.valor / produto.parcelas).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

            document.querySelector('.splide__list').innerHTML += `
                <li class="splide__slide">
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
                </li>
            `;
        });

        document.querySelectorAll('.item-produto button').forEach(carrinhoBtn => {
            carrinhoBtn.addEventListener('click', () => addCart(produtos, carrinhoBtn.dataset.id));
        });

        // todo nome do produto é um link que, ao ser clicado, salva o id do produto no localstorage antes de ir para a página
        document.querySelectorAll('.title-link').forEach(link => {
            link.addEventListener('click', e => {
                localStorage.setItem('produtoId', link.dataset.id);
            });
        });

        splide.mount();
    });
}