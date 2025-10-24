import { Produto, ProdutoModel, CategoriaProduto, TamanhoPizza } from '../models/Produto';

export class ProdutoService {
  static cadastrarProduto(dadosProduto: Omit<Produto, 'id' | 'dataCadastro' | 'disponivel'>): Produto {
    // Validar dados obrigatórios
    this.validarDadosProduto(dadosProduto);

    const produto = ProdutoModel.adicionar({
      ...dadosProduto,
      disponivel: true
    });

    return produto;
  }

  static listarProdutos(): Produto[] {
    return ProdutoModel.buscarTodos();
  }

  static listarProdutosPorCategoria(categoria: CategoriaProduto): Produto[] {
    return ProdutoModel.buscarPorCategoria(categoria);
  }

  static listarPizzas(): Produto[] {
    return ProdutoModel.buscarPizzas();
  }

  static buscarProdutoPorId(id: string): Produto | null {
    const produto = ProdutoModel.buscarPorId(id);
    return produto || null;
  }

  static atualizarProduto(id: string, dadosAtualizacao: Partial<Omit<Produto, 'id' | 'dataCadastro'>>): Produto | null {
    // Verificar se o produto existe
    const produtoExistente = ProdutoModel.buscarPorId(id);
    if (!produtoExistente) {
      throw new Error('Produto não encontrado');
    }

    // Validar dados se fornecidos
    if (dadosAtualizacao.nome || dadosAtualizacao.preco || dadosAtualizacao.categoria) {
      this.validarDadosProduto({
        nome: dadosAtualizacao.nome || produtoExistente.nome,
        descricao: dadosAtualizacao.descricao || produtoExistente.descricao,
        categoria: dadosAtualizacao.categoria || produtoExistente.categoria,
        preco: dadosAtualizacao.preco || produtoExistente.preco,
        tamanho: dadosAtualizacao.tamanho || produtoExistente.tamanho,
        ingredientes: dadosAtualizacao.ingredientes || produtoExistente.ingredientes
      });
    }

    return ProdutoModel.atualizar(id, dadosAtualizacao);
  }

  static excluirProduto(id: string): boolean {
    const produto = ProdutoModel.buscarPorId(id);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    return ProdutoModel.excluir(id);
  }

  static buscarProdutosPorNome(nome: string): Produto[] {
    const produtos = ProdutoModel.buscarTodos();
    return produtos.filter(produto => 
      produto.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  static buscarPizzasPorTamanho(tamanho: TamanhoPizza): Produto[] {
    const pizzas = ProdutoModel.buscarPizzas();
    return pizzas.filter(pizza => pizza.tamanho === tamanho);
  }

  static buscarProdutosPorFaixaPreco(precoMin: number, precoMax: number): Produto[] {
    const produtos = ProdutoModel.buscarTodos();
    return produtos.filter(produto => 
      produto.preco >= precoMin && produto.preco <= precoMax
    );
  }

  private static validarDadosProduto(dados: Partial<Produto>): void {
    if (!dados.nome || dados.nome.trim().length < 2) {
      throw new Error('Nome do produto deve ter pelo menos 2 caracteres');
    }

    if (!dados.descricao || dados.descricao.trim().length < 5) {
      throw new Error('Descrição deve ter pelo menos 5 caracteres');
    }

    if (!dados.categoria) {
      throw new Error('Categoria é obrigatória');
    }

    if (!dados.preco || dados.preco <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }

    // Validações específicas para pizzas
    if (dados.categoria === CategoriaProduto.PIZZA) {
      if (!dados.tamanho) {
        throw new Error('Tamanho é obrigatório para pizzas');
      }
      if (!dados.ingredientes || dados.ingredientes.length === 0) {
        throw new Error('Ingredientes são obrigatórios para pizzas');
      }
    }
  }
}


