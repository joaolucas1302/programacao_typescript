export enum StatusPedido {
  PENDENTE = 'pendente',
  PREPARANDO = 'preparando',
  PRONTO = 'pronto',
  ENTREGUE = 'entregue',
  CANCELADO = 'cancelado'
}

export enum FormaPagamento {
  DINHEIRO = 'dinheiro',
  CARTAO_CREDITO = 'cartao_credito',
  CARTAO_DEBITO = 'cartao_debito',
  PIX = 'pix',
  VALE_REFEICAO = 'vale_refeicao'
}

export interface ItemPedido {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  observacoes?: string;
}

export interface Pedido {
  id: string;
  clienteId: string;
  itens: ItemPedido[];
  status: StatusPedido;
  formaPagamento: FormaPagamento;
  subtotal: number;
  desconto: number;
  taxaEntrega: number;
  total: number;
  observacoes?: string;
  dataPedido: Date;
  dataEntrega?: Date;
  enderecoEntrega?: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
  };
}

import { CSVManager } from '../utils/CSVManager';
import { IDManager } from '../utils/IDManager';
import { ComprovanteGenerator } from '../utils/ComprovanteGenerator';
import { ClienteModel } from './Cliente';

export class PedidoModel {
  private static pedidos: Pedido[] = [];
  private static headers = ['id', 'clienteId', 'itens', 'status', 'formaPagamento', 'subtotal', 'desconto', 'taxaEntrega', 'total', 'observacoes', 'dataPedido', 'dataEntrega', 'enderecoEntrega'];

  static inicializar(): void {
    this.carregarDados();
  }

  static adicionar(pedido: Omit<Pedido, 'id' | 'dataPedido'>): Pedido {
    const novoPedido: Pedido = {
      ...pedido,
      id: IDManager.gerarId('pedido'),
      dataPedido: new Date(),
    };
    this.pedidos.push(novoPedido);
    this.salvarDados();
    
    // Gerar comprovante automaticamente
    this.gerarComprovanteAutomatico(novoPedido);
    
    return novoPedido;
  }

  private static gerarComprovanteAutomatico(pedido: Pedido): void {
    try {
      const cliente = ClienteModel.buscarPorId(pedido.clienteId);
      if (cliente) {
        const comprovante = ComprovanteGenerator.gerarComprovante(pedido, cliente);
        const dataAtual = new Date().toISOString().split('T')[0];
        const horaAtual = new Date().toLocaleTimeString('pt-BR').replace(/:/g, '-');
        const nomeArquivo = `comprovante_pedido_${pedido.id}_${dataAtual}_${horaAtual}`;
        
        ComprovanteGenerator.salvarComprovante(comprovante, nomeArquivo);
        console.log(`\nComprovante do pedido ${pedido.id} gerado!`);
      }
    } catch (error) {
      console.log(`\nErro ao gerar comprovante: ${error}`);
    }
  }

  static buscarTodos(): Pedido[] {
    return this.pedidos;
  }

  static buscarPorId(id: string): Pedido | undefined {
    return this.pedidos.find(pedido => pedido.id === id);
  }

  static buscarPorCliente(clienteId: string): Pedido[] {
    return this.pedidos.filter(pedido => pedido.clienteId === clienteId);
  }

  static buscarPorStatus(status: StatusPedido): Pedido[] {
    return this.pedidos.filter(pedido => pedido.status === status);
  }

  static buscarPorData(data: Date): Pedido[] {
    const inicioDia = new Date(data);
    inicioDia.setHours(0, 0, 0, 0);
    const fimDia = new Date(data);
    fimDia.setHours(23, 59, 59, 999);

    return this.pedidos.filter(pedido => 
      pedido.dataPedido >= inicioDia && pedido.dataPedido <= fimDia
    );
  }

  static buscarPorMes(ano: number, mes: number): Pedido[] {
    const inicioMes = new Date(ano, mes - 1, 1);
    const fimMes = new Date(ano, mes, 0, 23, 59, 59, 999);

    return this.pedidos.filter(pedido => 
      pedido.dataPedido >= inicioMes && pedido.dataPedido <= fimMes
    );
  }

  static atualizarStatus(id: string, status: StatusPedido): Pedido | null {
    const index = this.pedidos.findIndex(pedido => pedido.id === id);
    if (index === -1) return null;

    this.pedidos[index].status = status;
    if (status === StatusPedido.ENTREGUE) {
      this.pedidos[index].dataEntrega = new Date();
    }
    this.salvarDados();
    return this.pedidos[index];
  }

  static calcularTotal(itens: ItemPedido[], desconto: number = 0, taxaEntrega: number = 0): number {
    const subtotal = itens.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);
    return subtotal - desconto + taxaEntrega;
  }

  private static carregarDados(): void {
    this.pedidos = CSVManager.carregarDados('pedidos', (linha: string[]) => {
      const pedido: Pedido = {
        id: linha[0],
        clienteId: linha[1],
        itens: JSON.parse(linha[2] || '[]'),
        status: linha[3] as StatusPedido,
        formaPagamento: linha[4] as FormaPagamento,
        subtotal: parseFloat(linha[5]),
        desconto: parseFloat(linha[6]),
        taxaEntrega: parseFloat(linha[7]),
        total: parseFloat(linha[8]),
        observacoes: linha[9] || undefined,
        dataPedido: new Date(linha[10]),
        dataEntrega: linha[11] ? new Date(linha[11]) : undefined,
        enderecoEntrega: linha[12] ? JSON.parse(linha[12]) : undefined
      };
      return pedido;
    });

    // Atualizar contador de IDs - agora trabalha com IDs numéricos simples
    if (this.pedidos.length > 0) {
      const maxId = Math.max(...this.pedidos.map(p => {
        const idNumerico = parseInt(p.id);
        return isNaN(idNumerico) ? 0 : idNumerico;
      }));
      IDManager.definirContador('pedido', maxId);
    } else {
      IDManager.definirContador('pedido', 0);
    }
  }

  private static salvarDados(): void {
    CSVManager.salvarDados('pedidos', this.pedidos, this.headers);
  }
}
