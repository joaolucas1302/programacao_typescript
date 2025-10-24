import { PromocaoModel, TipoPromocao, Promocao } from '../models/Promocao';
import { ProdutoModel } from '../models/Produto';

export class PromocaoController {
  private static readline = require('readline-sync');

  static cadastrarPromocao(): void {
    console.log('\n' + '='.repeat(50));
    console.log('CADASTRAR PROMOÇÃO');
    console.log('='.repeat(50));

    try {
      const nome = this.readline.question('Nome da promoção: ');
      if (!nome.trim()) {
        throw new Error('Nome da promoção é obrigatório');
      }

      const descricao = this.readline.question('Descrição da promoção: ');
      if (!descricao.trim()) {
        throw new Error('Descrição da promoção é obrigatória');
      }

      // Exibir tipos de promoção disponíveis
      console.log('\nTipos de promoção disponíveis:');
      console.log('1. Desconto Percentual (ex: 10% de desconto)');
      console.log('2. Desconto Fixo (ex: R$ 5,00 de desconto)');
      console.log('3. Pizza Grátis (ex: ganhe uma pizza)');
      console.log('4. Combo (ex: combo especial)');

      const tipoOpcao = this.readline.question('Escolha o tipo (1-4): ');
      let tipo: TipoPromocao;

      switch (tipoOpcao) {
        case '1':
          tipo = TipoPromocao.DESCONTO_PERCENTUAL;
          break;
        case '2':
          tipo = TipoPromocao.DESCONTO_FIXO;
          break;
        case '3':
          tipo = TipoPromocao.PIZZA_GRATIS;
          break;
        case '4':
          tipo = TipoPromocao.COMBO;
          break;
        default:
          throw new Error('Tipo de promoção inválido');
      }

      let valor = 0;
      if (tipo === TipoPromocao.DESCONTO_PERCENTUAL || tipo === TipoPromocao.DESCONTO_FIXO) {
        const valorStr = this.readline.question('Valor do desconto: ');
        valor = parseFloat(valorStr);
        if (isNaN(valor) || valor <= 0) {
          throw new Error('Valor deve ser um número positivo');
        }
      }

      // Valor mínimo do pedido
      const valorMinimoStr = this.readline.question('Valor mínimo do pedido (deixe em branco se não houver): ');
      const valorMinimo = valorMinimoStr.trim() ? parseFloat(valorMinimoStr) : undefined;
      if (valorMinimo !== undefined && (isNaN(valorMinimo) || valorMinimo < 0)) {
        throw new Error('Valor mínimo deve ser um número positivo');
      }

      // Produtos aplicáveis
      let produtosAplicaveis: string[] | undefined;
      const aplicarProdutos = this.readline.question('Aplicar a produtos específicos? (s/n): ');
      if (aplicarProdutos.toLowerCase() === 's') {
        produtosAplicaveis = this.selecionarProdutos();
      }

      // Data de início
      const dataInicioStr = this.readline.question('Data de início (DD/MM/AAAA): ');
      const dataInicio = this.parsearData(dataInicioStr);

      // Data de fim
      const dataFimStr = this.readline.question('Data de fim (DD/MM/AAAA): ');
      const dataFim = this.parsearData(dataFimStr);

      if (dataFim <= dataInicio) {
        throw new Error('Data de fim deve ser posterior à data de início');
      }

      // Limite de usos por cliente
      const limiteUsosStr = this.readline.question('Limite de usos por cliente (deixe em branco se ilimitado): ');
      const limiteUsos = limiteUsosStr.trim() ? parseInt(limiteUsosStr) : undefined;
      if (limiteUsos !== undefined && (isNaN(limiteUsos) || limiteUsos <= 0)) {
        throw new Error('Limite de usos deve ser um número positivo');
      }

      // Status ativo
      const ativa = this.readline.question('Promoção ativa? (s/n): ').toLowerCase() === 's';

      const promocao = PromocaoModel.adicionar({
        nome,
        descricao,
        tipo,
        valor,
        valorMinimo,
        produtosAplicaveis,
        dataInicio,
        dataFim,
        ativa
      });

      console.log('\n✅ Promoção cadastrada com sucesso!');
      console.log(`ID: ${promocao.id}`);
      console.log(`Nome: ${promocao.nome}`);
      console.log(`Tipo: ${this.getTipoDescricao(promocao.tipo)}`);
      console.log(`Período: ${dataInicio.toLocaleDateString('pt-BR')} a ${dataFim.toLocaleDateString('pt-BR')}`);

    } catch (error) {
      console.log(`\n❌ Erro ao cadastrar promoção: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  static listarPromocoes(): void {
    console.log('\n' + '='.repeat(50));
    console.log('LISTAR PROMOÇÕES');
    console.log('='.repeat(50));

    const promocoes = PromocaoModel.buscarTodas();

    if (promocoes.length === 0) {
      console.log('\n📭 Nenhuma promoção cadastrada.');
      return;
    }

    promocoes.forEach((promocao, index) => {
      console.log(`\n${index + 1}. ${promocao.nome}`);
      console.log(`   ID: ${promocao.id}`);
      console.log(`   Descrição: ${promocao.descricao}`);
      console.log(`   Tipo: ${this.getTipoDescricao(promocao.tipo)}`);
      if (promocao.valor > 0) {
        console.log(`   Valor: ${promocao.tipo === TipoPromocao.DESCONTO_PERCENTUAL ? promocao.valor + '%' : 'R$ ' + promocao.valor.toFixed(2)}`);
      }
      if (promocao.valorMinimo) {
        console.log(`   Valor mínimo: R$ ${promocao.valorMinimo.toFixed(2)}`);
      }
      console.log(`   Período: ${promocao.dataInicio.toLocaleDateString('pt-BR')} a ${promocao.dataFim.toLocaleDateString('pt-BR')}`);
      console.log(`   Status: ${promocao.ativa ? '✅ Ativa' : '❌ Inativa'}`);
      if (promocao.limiteUsos) {
        console.log(`   Limite de usos: ${promocao.limiteUsos} por cliente`);
      }
    });
  }

  static listarPromocoesAtivas(): void {
    console.log('\n' + '='.repeat(50));
    console.log('PROMOÇÕES ATIVAS');
    console.log('='.repeat(50));

    const promocoes = PromocaoModel.buscarAtivas();

    if (promocoes.length === 0) {
      console.log('\n📭 Nenhuma promoção ativa no momento.');
      return;
    }

    promocoes.forEach((promocao, index) => {
      console.log(`\n${index + 1}. ${promocao.nome}`);
      console.log(`   Descrição: ${promocao.descricao}`);
      console.log(`   Tipo: ${this.getTipoDescricao(promocao.tipo)}`);
      if (promocao.valor > 0) {
        console.log(`   Valor: ${promocao.tipo === TipoPromocao.DESCONTO_PERCENTUAL ? promocao.valor + '%' : 'R$ ' + promocao.valor.toFixed(2)}`);
      }
      if (promocao.valorMinimo) {
        console.log(`   Valor mínimo: R$ ${promocao.valorMinimo.toFixed(2)}`);
      }
      console.log(`   Válida até: ${promocao.dataFim.toLocaleDateString('pt-BR')}`);
    });
  }

  static buscarPromocao(): void {
    console.log('\n' + '='.repeat(50));
    console.log('BUSCAR PROMOÇÃO');
    console.log('='.repeat(50));

    const termo = this.readline.question('Digite o nome ou ID da promoção: ');
    if (!termo.trim()) {
      console.log('\n❌ Termo de busca é obrigatório.');
      return;
    }

    const promocoes = PromocaoModel.buscarTodas();
    const promocoesEncontradas = promocoes.filter(promocao => 
      promocao.nome.toLowerCase().includes(termo.toLowerCase()) ||
      promocao.id === termo
    );

    if (promocoesEncontradas.length === 0) {
      console.log('\n📭 Nenhuma promoção encontrada.');
      return;
    }

    console.log(`\n🔍 Encontradas ${promocoesEncontradas.length} promoção(ões):`);
    promocoesEncontradas.forEach((promocao, index) => {
      console.log(`\n${index + 1}. ${promocao.nome}`);
      console.log(`   ID: ${promocao.id}`);
      console.log(`   Descrição: ${promocao.descricao}`);
      console.log(`   Tipo: ${this.getTipoDescricao(promocao.tipo)}`);
      console.log(`   Status: ${promocao.ativa ? '✅ Ativa' : '❌ Inativa'}`);
    });
  }

  static ativarDesativarPromocao(): void {
    console.log('\n' + '='.repeat(50));
    console.log('ATIVAR/DESATIVAR PROMOÇÃO');
    console.log('='.repeat(50));

    const id = this.readline.question('ID da promoção: ');
    if (!id.trim()) {
      console.log('\n❌ ID é obrigatório.');
      return;
    }

    const promocao = PromocaoModel.buscarPorId(id);
    if (!promocao) {
      console.log('\n❌ Promoção não encontrada.');
      return;
    }

    console.log(`\nPromoção: ${promocao.nome}`);
    console.log(`Status atual: ${promocao.ativa ? 'Ativa' : 'Inativa'}`);

    const novaAcao = this.readline.question(`Deseja ${promocao.ativa ? 'desativar' : 'ativar'} a promoção? (s/n): `);
    if (novaAcao.toLowerCase() === 's') {
      promocao.ativa = !promocao.ativa;
      // Aqui você precisaria implementar um método para salvar a alteração
      console.log(`\n✅ Promoção ${promocao.ativa ? 'ativada' : 'desativada'} com sucesso!`);
    }
  }

  private static selecionarProdutos(): string[] {
    const produtos = ProdutoModel.buscarTodos();
    if (produtos.length === 0) {
      console.log('\n⚠️ Nenhum produto cadastrado.');
      return [];
    }

    console.log('\nProdutos disponíveis:');
    produtos.forEach((produto, index) => {
      console.log(`${index + 1}. ${produto.nome} - R$ ${produto.preco.toFixed(2)}`);
    });

    const produtosSelecionados: string[] = [];
    let continuar = true;

    while (continuar) {
      const opcao = this.readline.question('Digite o número do produto (ou 0 para finalizar): ');
      const indice = parseInt(opcao) - 1;

      if (opcao === '0') {
        continuar = false;
      } else if (indice >= 0 && indice < produtos.length) {
        const produto = produtos[indice];
        if (!produtosSelecionados.includes(produto.id)) {
          produtosSelecionados.push(produto.id);
          console.log(`✅ ${produto.nome} adicionado à promoção.`);
        } else {
          console.log('⚠️ Produto já foi selecionado.');
        }
      } else {
        console.log('❌ Opção inválida.');
      }
    }

    return produtosSelecionados;
  }

  private static parsearData(dataStr: string): Date {
    const partes = dataStr.split('/');
    if (partes.length !== 3) {
      throw new Error('Data deve estar no formato DD/MM/AAAA');
    }

    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1; // Mês é 0-indexado
    const ano = parseInt(partes[2]);

    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
      throw new Error('Data inválida');
    }

    const data = new Date(ano, mes, dia);
    if (data.getDate() !== dia || data.getMonth() !== mes || data.getFullYear() !== ano) {
      throw new Error('Data inválida');
    }

    return data;
  }

  private static getTipoDescricao(tipo: TipoPromocao): string {
    switch (tipo) {
      case TipoPromocao.DESCONTO_PERCENTUAL:
        return 'Desconto Percentual';
      case TipoPromocao.DESCONTO_FIXO:
        return 'Desconto Fixo';
      case TipoPromocao.PIZZA_GRATIS:
        return 'Pizza Grátis';
      case TipoPromocao.COMBO:
        return 'Combo';
      default:
        return 'Desconhecido';
    }
  }
}
