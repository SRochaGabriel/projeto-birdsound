import produtos from '../../data/prod.json' with { type: 'json' };

// Função que retorna produtos do JSON para o usuário
export async function getProdutos(req, res) {
    // definindo os filtros que o usuário pode usar para 'tipo', 'categoria' e 'fabricante'
    let userFiltros = {
        tipo:  [...new Set(produtos.map(produto => produto.tipo))],
        fabricante:  [...new Set(produtos.map(produto => produto.fabricante))],
        categoria:  [...new Set(produtos.map(produto => produto.categoria))]
    };

    // definindo o limite de itens a serem enviados por página, pegando a página buscada pelo front via params.page e calculando o total de paginas
    const limiteItens = 15;
    const pagina = Number(req.params.page);
    const totalPaginas = Math.ceil(produtos.length / limiteItens);

    // se uma pagina inexistente foi requisitada
    if (pagina > totalPaginas) {
        return res.status(400).json({message: 'Página inexistente'});
    }

    // caso não tenham valores na query, envia todos os produtos
    if (Object.keys(req.query).length === 0) {
        const produtosPagina = getProdutosPage(pagina, limiteItens);
        return res.status(200).json({paginas: totalPaginas, produtos: produtosPagina, filtros: userFiltros})
    }

    const filtros = req.query;

    // filtra sobre 'produtos', passando por cada valor de filtro e retornando apenas os itens que finalizam o for loop sem cair no retorno falso
    const produtosFiltro = produtos.filter(produto => {
        for (let item of Object.keys(filtros)) {
            if (produto[item] != filtros[item]) {
                return false;
            }
        }
        return true;
    });

    // caso tenham produtos depois de passar pelo filtro
    if (produtosFiltro.length > 0){
        return res.status(200).json({paginas: 0, produtos: produtosFiltro, filtros: userFiltros});
    }
    
    // caso o filtro tenha retornado vazio
    res.status(404).json({message: 'Não foi possível encontrar produtos de acordo com esses filtros.'});
}

// função que retorna somente os produtos da página requisitada
function getProdutosPage(pagina, limiteItens) {
    // separando o array 'produtos' com base nas posições válidas de acordo com a página
    const startIndex = (pagina - 1) * limiteItens;
    const endIndex = pagina * limiteItens;

    return produtos.slice(startIndex, endIndex);
}