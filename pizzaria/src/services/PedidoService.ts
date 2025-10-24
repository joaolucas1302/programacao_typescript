import { Pedido, PedidoModel, ItemPedido, StatusPedido, FormaPagamento } from '../models/Pedido';
import { ProdutoService } from './ProdutoService';
import { ClienteService } from './ClienteService';
import { PromocaoService } from './PromocaoService';

export class PedidoService {
  static criarPedido(dadosPedido: {
    clienteId: string;
    itens: Omit<ItemPedido, 'precoUnitario'>[];
    formaPagamento: FormaPagamento;
    observacoes?: string;
    enderecoEntrega?: any;
  }): Pedido {
    // Verificar se o cliente existe
    const cliente = ClienteService.buscarClientePorId(dadosPedido.clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    // Validar e processar itens
    const itensProcessados = this.processarItens(dadosPedido.itens);

    // Calcular subtotal
    const subtotal = itensProcessados.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);

    // Aplicar promoções
    const { desconto, promocaoAplicada } = PromocaoService.aplicarMelhorPromocao({
      clienteId: dadosPedido.clienteId,
      itens: itensProcessados,
      subtotal
    });

    // Calcular taxa de entrega (se aplicável)
    const taxaEntrega = this.calcularTaxaEntrega(subtotal, dadosPedido.enderecoEntrega);

    // Calcular total
    const total = PedidoModel.calcularTotal(itensProcessados, desconto, taxaEntrega);

    const pedido = PedidoModel.adicionar({
      clienteId: dadosPedido.clienteId,
      itens: itensProcessados,
      status: StatusPedido.PENDENTE,
      formaPagamento: dadosPedido.formaPagamento,
      subtotal,
      desconto,
      taxaEntrega,
      total,
      observacoes: dadosPedido.observacoes,
      enderecoEntrega: dadosPedido.enderecoEntrega
    });

    return pedido;
  }

  static listarPedidos(): Pedido[] {
    return PedidoModel.buscarTodos();
  }

  static buscarPedidoPorId(id: string): Pedido | null {
    const pedido = PedidoModel.buscarPorId(id);
    return pedido || null;
  }

  static buscarPedidosPorCliente(clienteId: string): Pedido[] {
    return PedidoModel.buscarPorCliente(clienteId);
  }

  static buscarPedidosPorStatus(status: StatusPedido): Pedido[] {
    return PedidoModel.buscarPorStatus(status);
  }

  static atualizarStatusPedido(id: string, status: StatusPedido): Pedido | null {
    const pedido = PedidoModel.buscarPorId(id);
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    return PedidoModel.atualizarStatus(id, status);
  }

  static buscarPedidosDoDia(data: Date = new Date()): Pedido[] {
    return PedidoModel.buscarPorData(data);
  }

  static buscarPedidosDoMes(ano: number, mes: number): Pedido[] {
    return PedidoModel.buscarPorMes(ano, mes);
  }

  static gerarRelatorioVendasDiario(data: Date = new Date()): {
    data: Date;
    totalPedidos: number;
    totalVendas: number;
    pizzasVendidas: number;
    pedidosPorStatus: Record<StatusPedido, number>;
  } {
    const pedidos = this.buscarPedidosDoDia(data);
    
    const totalPedidos = pedidos.length;
    const totalVendas = pedidos.reduce((total, pedido) => total + pedido.total, 0);
    
    const pizzasVendidas = pedidos.reduce((total, pedido) => {
      return total + pedido.itens.reduce((subtotal, item) => {
        const produto = ProdutoService.buscarProdutoPorId(item.produtoId);
        return subtotal + (produto?.categoria === 'pizza' ? item.quantidade : 0);
      }, 0);
    }, 0);

    const pedidosPorStatus = pedidos.reduce((acc, pedido) => {
      acc[pedido.status] = (acc[pedido.status] || 0) + 1;
      return acc;
    }, {} as Record<StatusPedido, number>);

    return {
      data,
      totalPedidos,
      totalVendas,
      pizzasVendidas,
      pedidosPorStatus
    };
  }

  static gerarRelatorioVendasMensal(ano: number, mes: number): {
    ano: number;
    mes: number;
    totalPedidos: number;
    totalVendas: number;
    pizzasVendidas: number;
    pedidosPorStatus: Record<StatusPedido, number>;
    vendasPorDia: Array<{ dia: number; vendas: number; pizzas: number }>;
  } {
    const pedidos = this.buscarPedidosDoMes(ano, mes);
    
    const totalPedidos = pedidos.length;
    const totalVendas = pedidos.reduce((total, pedido) => total + pedido.total, 0);
    
    const pizzasVendidas = pedidos.reduce((total, pedido) => {
      return total + pedido.itens.reduce((subtotal, item) => {
        const produto = ProdutoService.buscarProdutoPorId(item.produtoId);
        return subtotal + (produto?.categoria === 'pizza' ? item.quantidade : 0);
      }, 0);
    }, 0);

    const pedidosPorStatus = pedidos.reduce((acc, pedido) => {
      acc[pedido.status] = (acc[pedido.status] || 0) + 1;
      return acc;
    }, {} as Record<StatusPedido, number>);

    // Agrupar vendas por dia
    const vendasPorDia = Array.from({ length: 31 }, (_, i) => {
      const dia = i + 1;
      const pedidosDoDia = pedidos.filter(pedido => pedido.dataPedido.getDate() === dia);
      const vendas = pedidosDoDia.reduce((total, pedido) => total + pedido.total, 0);
      const pizzas = pedidosDoDia.reduce((total, pedido) => {
        return total + pedido.itens.reduce((subtotal, item) => {
          const produto = ProdutoService.buscarProdutoPorId(item.produtoId);
          return subtotal + (produto?.categoria === 'pizza' ? item.quantidade : 0);
        }, 0);
      }, 0);
      
      return { dia, vendas, pizzas };
    }).filter(dia => dia.vendas > 0);

    return {
      ano,
      mes,
      totalPedidos,
      totalVendas,
      pizzasVendidas,
      pedidosPorStatus,
      vendasPorDia
    };
  }

  private static processarItens(itens: Omit<ItemPedido, 'precoUnitario'>[]): ItemPedido[] {
    return itens.map(item => {
      const produto = ProdutoService.buscarProdutoPorId(item.produtoId);
      if (!produto) {
        throw new Error(`Produto com ID ${item.produtoId} não encontrado`);
      }

      if (!produto.disponivel) {
        throw new Error(`Produto ${produto.nome} não está disponível`);
      }

      if (item.quantidade <= 0) {
        throw new Error(`Quantidade deve ser maior que zero para o produto ${produto.nome}`);
      }

      return {
        ...item,
        precoUnitario: produto.preco
      };
    });
  }

  private static calcularTaxaEntrega(subtotal: number, enderecoEntrega?: any): number {
    // Taxa de entrega gratuita para pedidos acima de R$ 50,00
    if (subtotal >= 50) {
      return 0;
    }

    // Taxa de entrega de R$ 5,00 para pedidos abaixo de R$ 50,00
    return enderecoEntrega ? 5 : 0;
  }
}


