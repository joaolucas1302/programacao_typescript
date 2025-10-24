export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
  };
  dataCadastro: Date;
  ativo: boolean;
}

import { CSVManager } from '../utils/CSVManager';
import { IDManager } from '../utils/IDManager';

export class ClienteModel {
  private static clientes: Cliente[] = [];
  private static headers = ['id', 'nome', 'email', 'telefone', 'endereco', 'dataCadastro', 'ativo'];

  static inicializar(): void {
    this.carregarDados();
  }

  static adicionar(cliente: Omit<Cliente, 'id' | 'dataCadastro'>): Cliente {
    const novoCliente: Cliente = {
      ...cliente,
      id: IDManager.gerarId('cliente'),
      dataCadastro: new Date(),
    };
    this.clientes.push(novoCliente);
    this.salvarDados();
    return novoCliente;
  }

  static buscarTodos(): Cliente[] {
    return this.clientes.filter(cliente => cliente.ativo);
  }

  static buscarPorId(id: string): Cliente | undefined {
    return this.clientes.find(cliente => cliente.id === id && cliente.ativo);
  }

  static buscarPorEmail(email: string): Cliente | undefined {
    return this.clientes.find(cliente => cliente.email === email && cliente.ativo);
  }

  static atualizar(id: string, dadosAtualizacao: Partial<Omit<Cliente, 'id' | 'dataCadastro'>>): Cliente | null {
    const index = this.clientes.findIndex(cliente => cliente.id === id && cliente.ativo);
    if (index === -1) return null;

    this.clientes[index] = { ...this.clientes[index], ...dadosAtualizacao };
    this.salvarDados();
    return this.clientes[index];
  }

  static excluir(id: string): boolean {
    const index = this.clientes.findIndex(cliente => cliente.id === id && cliente.ativo);
    if (index === -1) return false;

    this.clientes[index].ativo = false;
    this.salvarDados();
    return true;
  }

  private static carregarDados(): void {
    this.clientes = CSVManager.carregarDados('clientes', (linha: string[]) => {
      const cliente: Cliente = {
        id: linha[0],
        nome: linha[1],
        email: linha[2],
        telefone: linha[3],
        endereco: JSON.parse(linha[4] || '{}'),
        dataCadastro: new Date(linha[5]),
        ativo: linha[6] === 'true'
      };
      return cliente;
    });

    // Atualizar contador de IDs - agora trabalha com IDs numéricos simples
    if (this.clientes.length > 0) {
      const maxId = Math.max(...this.clientes.map(c => {
        const idNumerico = parseInt(c.id);
        return isNaN(idNumerico) ? 0 : idNumerico;
      }));
      IDManager.definirContador('cliente', maxId);
    } else {
      IDManager.definirContador('cliente', 0);
    }
  }

  private static salvarDados(): void {
    CSVManager.salvarDados('clientes', this.clientes, this.headers);
  }
}
