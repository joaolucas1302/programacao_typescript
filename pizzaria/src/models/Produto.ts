export enum CategoriaProduto {
  PIZZA = 'pizza',
  REFRIGERANTE = 'refrigerante',
  SOBREMESA = 'sobremesa',
  OUTROS = 'outros'
}

export enum TamanhoPizza {
  PEQUENA = 'pequena',
  MEDIA = 'media',
  GRANDE = 'grande',
  FAMILIA = 'familia'
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  categoria: CategoriaProduto;
  preco: number;
  tamanho?: TamanhoPizza;
  ingredientes?: string[];
  disponivel: boolean;
  dataCadastro: Date;
}

import { CSVManager } from '../utils/CSVManager';
import { IDManager } from '../utils/IDManager';

export class ProdutoModel {
  private static produtos: Produto[] = [];
  private static headers = ['id', 'nome', 'descricao', 'categoria', 'preco', 'tamanho', 'ingredientes', 'disponivel', 'dataCadastro'];

  static inicializar(): void {
    this.carregarDados();
  }

  static adicionar(produto: Omit<Produto, 'id' | 'dataCadastro'>): Produto {
    const novoProduto: Produto = {
      ...produto,
      id: IDManager.gerarId('produto'),
      dataCadastro: new Date(),
    };
    this.produtos.push(novoProduto);
    this.salvarDados();
    return novoProduto;
  }

  static buscarTodos(): Produto[] {
    return this.produtos.filter(produto => produto.disponivel);
  }

  static buscarPorId(id: string): Produto | undefined {
    return this.produtos.find(produto => produto.id === id && produto.disponivel);
  }

  static buscarPorCategoria(categoria: CategoriaProduto): Produto[] {
    return this.produtos.filter(produto => produto.categoria === categoria && produto.disponivel);
  }

  static buscarPizzas(): Produto[] {
    return this.buscarPorCategoria(CategoriaProduto.PIZZA);
  }

  static atualizar(id: string, dadosAtualizacao: Partial<Omit<Produto, 'id' | 'dataCadastro'>>): Produto | null {
    const index = this.produtos.findIndex(produto => produto.id === id && produto.disponivel);
    if (index === -1) return null;

    this.produtos[index] = { ...this.produtos[index], ...dadosAtualizacao };
    this.salvarDados();
    return this.produtos[index];
  }

  static excluir(id: string): boolean {
    const index = this.produtos.findIndex(produto => produto.id === id && produto.disponivel);
    if (index === -1) return false;

    this.produtos[index].disponivel = false;
    this.salvarDados();
    return true;
  }

  private static carregarDados(): void {
    this.produtos = CSVManager.carregarDados('produtos', (linha: string[]) => {
      const produto: Produto = {
        id: linha[0],
        nome: linha[1],
        descricao: linha[2],
        categoria: linha[3] as CategoriaProduto,
        preco: parseFloat(linha[4]),
        tamanho: linha[5] ? linha[5] as TamanhoPizza : undefined,
        ingredientes: linha[6] ? JSON.parse(linha[6]) : undefined,
        disponivel: linha[7] === 'true',
        dataCadastro: new Date(linha[8])
      };
      return produto;
    });

    // Atualizar contador de IDs - agora trabalha com IDs numéricos simples
    if (this.produtos.length > 0) {
      const maxId = Math.max(...this.produtos.map(p => {
        const idNumerico = parseInt(p.id);
        return isNaN(idNumerico) ? 0 : idNumerico;
      }));
      IDManager.definirContador('produto', maxId);
    } else {
      IDManager.definirContador('produto', 0);
    }
  }

  private static salvarDados(): void {
    CSVManager.salvarDados('produtos', this.produtos, this.headers);
  }
}
