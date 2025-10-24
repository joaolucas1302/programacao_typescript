import { Promocao, PromocaoModel, TipoPromocao } from '../models/Promocao';

export class PromocaoService {
  static criarPromocao(dadosPromocao: Omit<Promocao, 'id' | 'usosPorCliente' | 'ativa'>): Promocao {
    // Validar dados da promoção
    this.validarDadosPromocao(dadosPromocao);

    const promocao = PromocaoModel.adicionar({
      ...dadosPromocao,
      ativa: true
    });

    return promocao;
  }

  static listarPromocoes(): Promocao[] {
    return PromocaoModel.buscarTodas();
  }

  static listarPromocoesAtivas(): Promocao[] {
    return PromocaoModel.buscarAtivas();
  }

  static buscarPromocaoPorId(id: string): Promocao | null {
    const promocao = PromocaoModel.buscarPorId(id);
    return promocao || null;
  }

  static aplicarMelhorPromocao(dadosPedido: {
    clienteId: string;
    itens: any[];
    subtotal: number;
  }): { desconto: number; promocaoAplicada: Promocao | null } {
    const promocoesAtivas = this.listarPromocoesAtivas();
    let melhorDesconto = 0;
    let melhorPromocao: Promocao | null = null;

    for (const promocao of promocoesAtivas) {
      const desconto = PromocaoModel.aplicarPromocao(dadosPedido, promocao);
      if (desconto > melhorDesconto) {
        melhorDesconto = desconto;
        melhorPromocao = promocao;
      }
    }

    return {
      desconto: melhorDesconto,
      promocaoAplicada: melhorPromocao
    };
  }

  static desativarPromocao(id: string): boolean {
    const promocao = PromocaoModel.buscarPorId(id);
    if (!promocao) {
      throw new Error('Promoção não encontrada');
    }

    promocao.ativa = false;
    return true;
  }

  static ativarPromocao(id: string): boolean {
    const promocao = PromocaoModel.buscarPorId(id);
    if (!promocao) {
      throw new Error('Promoção não encontrada');
    }

    promocao.ativa = true;
    return true;
  }

  static criarPromocoesPadrao(): void {
    const promocoes = [
      {
        nome: 'Desconto 10% - Primeira Compra',
        descricao: '10% de desconto na primeira compra',
        tipo: TipoPromocao.DESCONTO_PERCENTUAL,
        valor: 10,
        valorMinimo: 30,
        dataInicio: new Date(),
        dataFim: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
        limiteUsos: 1
      },
      {
        nome: 'Frete Grátis',
        descricao: 'Frete grátis para pedidos acima de R$ 50,00',
        tipo: TipoPromocao.DESCONTO_FIXO,
        valor: 5,
        valorMinimo: 50,
        dataInicio: new Date(),
        dataFim: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
      },
      {
        nome: 'Desconto 15% - Pizzas',
        descricao: '15% de desconto em todas as pizzas',
        tipo: TipoPromocao.DESCONTO_PERCENTUAL,
        valor: 15,
        dataInicio: new Date(),
        dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      }
    ];

    promocoes.forEach(promocao => {
      try {
        this.criarPromocao(promocao);
      } catch (error) {
        // Ignorar erros se a promoção já existir
      }
    });
  }

  private static validarDadosPromocao(dados: Partial<Promocao>): void {
    if (!dados.nome || dados.nome.trim().length < 3) {
      throw new Error('Nome da promoção deve ter pelo menos 3 caracteres');
    }

    if (!dados.descricao || dados.descricao.trim().length < 5) {
      throw new Error('Descrição deve ter pelo menos 5 caracteres');
    }

    if (!dados.tipo) {
      throw new Error('Tipo da promoção é obrigatório');
    }

    if (!dados.valor || dados.valor <= 0) {
      throw new Error('Valor deve ser maior que zero');
    }

    if (dados.tipo === TipoPromocao.DESCONTO_PERCENTUAL && dados.valor > 100) {
      throw new Error('Desconto percentual não pode ser maior que 100%');
    }

    if (!dados.dataInicio || !dados.dataFim) {
      throw new Error('Data de início e fim são obrigatórias');
    }

    if (dados.dataInicio >= dados.dataFim) {
      throw new Error('Data de início deve ser anterior à data de fim');
    }

    if (dados.dataFim <= new Date()) {
      throw new Error('Data de fim deve ser futura');
    }
  }
}


