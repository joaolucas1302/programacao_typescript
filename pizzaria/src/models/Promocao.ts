export enum TipoPromocao {
  DESCONTO_PERCENTUAL = 'desconto_percentual',
  DESCONTO_FIXO = 'desconto_fixo',
  PIZZA_GRATIS = 'pizza_gratis',
  COMBO = 'combo'
}

export interface Promocao {
  id: string;
  nome: string;
  descricao: string;
  tipo: TipoPromocao;
  valor: number; // percentual ou valor fixo
  valorMinimo?: number; // valor mínimo do pedido para aplicar a promoção
  produtosAplicaveis?: string[]; // IDs dos produtos que a promoção se aplica
  dataInicio: Date;
  dataFim: Date;
  ativa: boolean;
  limiteUsos?: number; // limite de usos por cliente
  usosPorCliente?: Map<string, number>; // controle de usos por cliente
}

import { CSVManager } from '../utils/CSVManager';
import { IDManager } from '../utils/IDManager';

export class PromocaoModel {
  private static promocoes: Promocao[] = [];
  private static headers = ['id', 'nome', 'descricao', 'tipo', 'valor', 'valorMinimo', 'produtosAplicaveis', 'dataInicio', 'dataFim', 'ativa', 'limiteUsos'];

  static inicializar(): void {
    this.carregarDados();
  }

  static adicionar(promocao: Omit<Promocao, 'id' | 'usosPorCliente'>): Promocao {
    const novaPromocao: Promocao = {
      ...promocao,
      id: IDManager.gerarId('promocao'),
      usosPorCliente: new Map(),
    };
    this.promocoes.push(novaPromocao);
    this.salvarDados();
    return novaPromocao;
  }

  static buscarTodas(): Promocao[] {
    return this.promocoes.filter(promocao => promocao.ativa);
  }

  static buscarAtivas(): Promocao[] {
    const agora = new Date();
    return this.promocoes.filter(promocao => 
      promocao.ativa && 
      promocao.dataInicio <= agora && 
      promocao.dataFim >= agora
    );
  }

  static buscarPorId(id: string): Promocao | undefined {
    return this.promocoes.find(promocao => promocao.id === id);
  }

  static aplicarPromocao(pedido: any, promocao: Promocao): number {
    // Verificar se a promoção é aplicável
    if (!this.verificarAplicabilidade(pedido, promocao)) {
      return 0;
    }

    let desconto = 0;

    switch (promocao.tipo) {
      case TipoPromocao.DESCONTO_PERCENTUAL:
        desconto = (pedido.subtotal * promocao.valor) / 100;
        break;
      case TipoPromocao.DESCONTO_FIXO:
        desconto = promocao.valor;
        break;
      case TipoPromocao.PIZZA_GRATIS:
        // Implementar lógica para pizza grátis
        break;
      case TipoPromocao.COMBO:
        // Implementar lógica para combo
        break;
    }

    // Atualizar contador de usos
    if (promocao.limiteUsos) {
      const usosAtuais = promocao.usosPorCliente?.get(pedido.clienteId) || 0;
      promocao.usosPorCliente?.set(pedido.clienteId, usosAtuais + 1);
    }

    return Math.min(desconto, pedido.subtotal);
  }

  private static verificarAplicabilidade(pedido: any, promocao: Promocao): boolean {
    // Verificar se está dentro do período de validade
    const agora = new Date();
    if (agora < promocao.dataInicio || agora > promocao.dataFim) {
      return false;
    }

    // Verificar valor mínimo
    if (promocao.valorMinimo && pedido.subtotal < promocao.valorMinimo) {
      return false;
    }

    // Verificar limite de usos por cliente
    if (promocao.limiteUsos) {
      const usosAtuais = promocao.usosPorCliente?.get(pedido.clienteId) || 0;
      if (usosAtuais >= promocao.limiteUsos) {
        return false;
      }
    }

    return true;
  }

  private static carregarDados(): void {
    this.promocoes = CSVManager.carregarDados('promocoes', (linha: string[]) => {
      const promocao: Promocao = {
        id: linha[0],
        nome: linha[1],
        descricao: linha[2],
        tipo: linha[3] as TipoPromocao,
        valor: parseFloat(linha[4]),
        valorMinimo: linha[5] ? parseFloat(linha[5]) : undefined,
        produtosAplicaveis: linha[6] ? JSON.parse(linha[6]) : undefined,
        dataInicio: new Date(linha[7]),
        dataFim: new Date(linha[8]),
        ativa: linha[9] === 'true',
        limiteUsos: linha[10] ? parseInt(linha[10]) : undefined,
        usosPorCliente: new Map()
      };
      return promocao;
    });

    // Atualizar contador de IDs - agora trabalha com IDs numéricos simples
    if (this.promocoes.length > 0) {
      const maxId = Math.max(...this.promocoes.map(p => {
        const idNumerico = parseInt(p.id);
        return isNaN(idNumerico) ? 0 : idNumerico;
      }));
      IDManager.definirContador('promocao', maxId);
    } else {
      IDManager.definirContador('promocao', 0);
    }
  }

  private static salvarDados(): void {
    CSVManager.salvarDados('promocoes', this.promocoes, this.headers);
  }
}
