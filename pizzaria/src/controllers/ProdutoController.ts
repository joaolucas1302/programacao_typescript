import { ProdutoService } from '../services/ProdutoService';
import { CategoriaProduto, TamanhoPizza } from '../models/Produto';

export class ProdutoController {
  static cadastrarProduto(): void {
    const readline = require('readline-sync');

    console.log('\n=== CADASTRO DE PRODUTO ===\n');

    const nome = readline.question('Nome do produto: ');
    const descricao = readline.question('Descrição: ');

    console.log('\nCategorias disponíveis:');
    console.log('1. Pizza');
    console.log('2. Refrigerante');
    console.log('3. Sobremesa');
    console.log('4. Outros');

    const categoriaOpcao = readline.question('Escolha a categoria: ');
    let categoria: CategoriaProduto;

    switch (categoriaOpcao) {
      case '1':
        categoria = CategoriaProduto.PIZZA;
        break;
      case '2':
        categoria = CategoriaProduto.REFRIGERANTE;
        break;
      case '3':
        categoria = CategoriaProduto.SOBREMESA;
        break;
      case '4':
        categoria = CategoriaProduto.OUTROS;
        break;
      default:
        console.log('Categoria inválida.');
        return;
    }

    const preco = parseFloat(readline.question('Preço: '));

    let tamanho: TamanhoPizza | undefined;
    let ingredientes: string[] | undefined;

    if (categoria === CategoriaProduto.PIZZA) {
      console.log('\nTamanhos disponíveis:');
      console.log('1. Pequena');
      console.log('2. Média');
      console.log('3. Grande');
      console.log('4. Família');

      const tamanhoOpcao = readline.question('Escolha o tamanho: ');
      switch (tamanhoOpcao) {
        case '1':
          tamanho = TamanhoPizza.PEQUENA;
          break;
        case '2':
          tamanho = TamanhoPizza.MEDIA;
          break;
        case '3':
          tamanho = TamanhoPizza.GRANDE;
          break;
        case '4':
          tamanho = TamanhoPizza.FAMILIA;
          break;
        default:
          console.log('Tamanho inválido.');
          return;
      }

      console.log('\nIngredientes (separados por vírgula): ');
      const ingredientesInput = readline.question('Ex: Queijo, Tomate, Manjericão: ');
      ingredientes = ingredientesInput.split(',').map((ing: string) => ing.trim()).filter((ing: string) => ing.length > 0);
    }

    try {
      const produto = ProdutoService.cadastrarProduto({
        nome,
        descricao,
        categoria,
        preco,
        tamanho,
        ingredientes
      });

      console.log('\nProduto cadastrado com sucesso!');
      console.log(`ID: ${produto.id}`);
    } catch (error: any) {
      console.log(`\nErro ao cadastrar produto: ${error.message}`);
    }
  }

  static listarProdutos(): void {
    console.log('\n=== LISTA DE PRODUTOS ===\n');

    const produtos = ProdutoService.listarProdutos();

    if (produtos.length === 0) {
      console.log('Nenhum produto cadastrado.');
      return;
    }

    produtos.forEach((produto, index) => {
      console.log(`${index + 1}. ${produto.nome}`);
      console.log(`   Descrição: ${produto.descricao}`);
      console.log(`   Categoria: ${produto.categoria}`);
      console.log(`   Preço: R$ ${produto.preco.toFixed(2)}`);
      if (produto.tamanho) {
        console.log(`   Tamanho: ${produto.tamanho}`);
      }
      if (produto.ingredientes && produto.ingredientes.length > 0) {
        console.log(`   Ingredientes: ${produto.ingredientes.join(', ')}`);
      }
      console.log('---');
    });
  }

  static listarPizzas(): void {
    console.log('\n=== PIZZAS DISPONÍVEIS ===\n');

    const pizzas = ProdutoService.listarPizzas();

    if (pizzas.length === 0) {
      console.log('Nenhuma pizza cadastrada.');
      return;
    }

    pizzas.forEach((pizza, index) => {
      console.log(`${index + 1}. ${pizza.nome}`);
      console.log(`   Descrição: ${pizza.descricao}`);
      console.log(`   Tamanho: ${pizza.tamanho}`);
      console.log(`   Preço: R$ ${pizza.preco.toFixed(2)}`);
      console.log(`   Ingredientes: ${pizza.ingredientes?.join(', ')}`);
      console.log('---');
    });
  }

  static buscarProduto(): void {
    const readline = require('readline-sync');

    console.log('\n=== BUSCAR PRODUTO ===\n');
    console.log('1. Buscar por ID');
    console.log('2. Buscar por nome');
    const opcao = readline.question('Escolha uma opção: ');

    let produto: any = null;

    switch (opcao) {
      case '1':
        const id = readline.question('ID do produto: ');
        produto = ProdutoService.buscarProdutoPorId(id);
        break;
      case '2':
        const nome = readline.question('Nome do produto: ');
        const produtos = ProdutoService.buscarProdutosPorNome(nome);
        if (produtos.length > 0) {
          console.log('\nProdutos encontrados:');
          produtos.forEach((p, index) => {
            console.log(`${index + 1}. ${p.nome} - R$ ${p.preco.toFixed(2)}`);
          });
          const escolha = readline.question('Escolha o produto (número): ');
          const indice = parseInt(escolha) - 1;
          if (indice >= 0 && indice < produtos.length) {
            produto = produtos[indice];
          }
        }
        break;
      default:
        console.log('Opção inválida.');
        return;
    }

    if (produto) {
      console.log('\nProduto encontrado:');
      console.log(`Nome: ${produto.nome}`);
      console.log(`Descrição: ${produto.descricao}`);
      console.log(`Categoria: ${produto.categoria}`);
      console.log(`Preço: R$ ${produto.preco.toFixed(2)}`);
      if (produto.tamanho) {
        console.log(`Tamanho: ${produto.tamanho}`);
      }
      if (produto.ingredientes && produto.ingredientes.length > 0) {
        console.log(`Ingredientes: ${produto.ingredientes.join(', ')}`);
      }
    } else {
      console.log('\nProduto não encontrado.');
    }
  }

  static atualizarProduto(): void {
    const readline = require('readline-sync');

    console.log('\n=== ATUALIZAR PRODUTO ===\n');

    const id = readline.question('ID do produto: ');
    const produto = ProdutoService.buscarProdutoPorId(id);

    if (!produto) {
      console.log('\nProduto não encontrado.');
      return;
    }

    console.log('\nProduto encontrado:');
    console.log(`Nome: ${produto.nome}`);
    console.log(`Preço: R$ ${produto.preco.toFixed(2)}`);

    console.log('\nDeixe em branco para manter o valor atual.\n');

    const novoNome = readline.question(`Novo nome [${produto.nome}]: `);
    const novoPreco = readline.question(`Novo preço [${produto.preco}]: `);

    const dadosAtualizacao: any = {};
    if (novoNome.trim()) dadosAtualizacao.nome = novoNome;
    if (novoPreco.trim()) dadosAtualizacao.preco = parseFloat(novoPreco);

    try {
      const produtoAtualizado = ProdutoService.atualizarProduto(id, dadosAtualizacao);
      if (produtoAtualizado) {
        console.log('\nProduto atualizado com sucesso!');
      }
    } catch (error: any) {
      console.log(`\nErro ao atualizar produto: ${error.message}`);
    }
  }

  static excluirProduto(): void {
    const readline = require('readline-sync');

    console.log('\n=== EXCLUIR PRODUTO ===\n');

    const id = readline.question('ID do produto: ');
    const produto = ProdutoService.buscarProdutoPorId(id);

    if (!produto) {
      console.log('\nProduto não encontrado.');
      return;
    }

    console.log('\nProduto encontrado:');
    console.log(`Nome: ${produto.nome}`);
    console.log(`Preço: R$ ${produto.preco.toFixed(2)}`);

    const confirmacao = readline.question('Tem certeza que deseja excluir este produto? (s/n): ');

    if (confirmacao.toLowerCase() === 's') {
      try {
        const sucesso = ProdutoService.excluirProduto(id);
        if (sucesso) {
          console.log('\nProduto excluído com sucesso!');
        }
      } catch (error: any) {
        console.log(`\nErro ao excluir produto: ${error.message}`);
      }
    } else {
      console.log('\nOperação cancelada.');
    }
  }
}
