import { PedidoService } from '../services/PedidoService';
import { ClienteService } from '../services/ClienteService';
import { ProdutoService } from '../services/ProdutoService';
import { StatusPedido, FormaPagamento } from '../models/Pedido';

export class PedidoController {
  static criarPedido(): void {
    const readline = require('readline-sync');

    console.log('\n=== CRIAR PEDIDO ===\n');

    // Buscar cliente
    const clienteId = readline.question('ID do cliente: ');
    const cliente = ClienteService.buscarClientePorId(clienteId);

    if (!cliente) {
      console.log('\nCliente não encontrado.');
      return;
    }

    console.log(`\nCliente: ${cliente.nome}`);
    console.log(`Email: ${cliente.email}`);

    // Listar produtos disponíveis
    console.log('\n=== PRODUTOS DISPONÍVEIS ===');
    const produtos = ProdutoService.listarProdutos();
    produtos.forEach((produto, index) => {
      console.log(`${index + 1}. ${produto.nome} - R$ ${produto.preco.toFixed(2)}`);
    });

    const itens: any[] = [];
    let continuar = true;

    while (continuar) {
      console.log('\n--- Adicionar Item ---');
      const produtoIndex = readline.question('Escolha o produto (número): ');
      const indice = parseInt(produtoIndex) - 1;

      if (indice < 0 || indice >= produtos.length) {
        console.log('Produto inválido.');
        continue;
      }

      const produto = produtos[indice];
      const quantidade = parseInt(readline.question('Quantidade: '));

      if (quantidade <= 0) {
        console.log('Quantidade deve ser maior que zero.');
        continue;
      }

      const observacoes = readline.question('Observações (opcional): ');

      itens.push({
        produtoId: produto.id,
        quantidade,
        observacoes: observacoes.trim() || undefined
      });

      console.log(`\nItem adicionado: ${produto.nome} x${quantidade}`);

      const adicionarMais = readline.question('Adicionar mais itens? (s/n): ');
      continuar = adicionarMais.toLowerCase() === 's';
    }

    if (itens.length === 0) {
      console.log('\nNenhum item adicionado ao pedido.');
      return;
    }

    // Escolher forma de pagamento
    console.log('\n=== FORMA DE PAGAMENTO ===');
    console.log('1. Dinheiro');
    console.log('2. Cartão de Crédito');
    console.log('3. Cartão de Débito');
    console.log('4. PIX');
    console.log('5. Vale Refeição');

    const formaPagamentoOpcao = readline.question('Escolha a forma de pagamento: ');
    let formaPagamento: FormaPagamento;

    switch (formaPagamentoOpcao) {
      case '1':
        formaPagamento = FormaPagamento.DINHEIRO;
        break;
      case '2':
        formaPagamento = FormaPagamento.CARTAO_CREDITO;
        break;
      case '3':
        formaPagamento = FormaPagamento.CARTAO_DEBITO;
        break;
      case '4':
        formaPagamento = FormaPagamento.PIX;
        break;
      case '5':
        formaPagamento = FormaPagamento.VALE_REFEICAO;
        break;
      default:
        console.log('Forma de pagamento inválida.');
        return;
    }

    // Endereço de entrega
    const entrega = readline.question('\nÉ para entrega? (s/n): ');
    let enderecoEntrega: any = undefined;

    if (entrega.toLowerCase() === 's') {
      console.log('\n=== ENDEREÇO DE ENTREGA ===');
      console.log('\n📍 Endereço cadastrado do cliente:');
      console.log(`   Rua: ${cliente.endereco.rua}, ${cliente.endereco.numero}`);
      console.log(`   Bairro: ${cliente.endereco.bairro}`);
      console.log(`   Cidade: ${cliente.endereco.cidade}`);
      console.log(`   CEP: ${cliente.endereco.cep}`);

      const usarEnderecoCliente = readline.question('\nDeseja usar este endereço? (s/n): ');

      if (usarEnderecoCliente.toLowerCase() === 's') {
        enderecoEntrega = { ...cliente.endereco };
        console.log('✅ Endereço do cliente selecionado!');
      } else {
        console.log('\n--- Novo Endereço de Entrega ---');
        const rua = readline.question('Rua: ');
        const numero = readline.question('Número: ');
        const bairro = readline.question('Bairro: ');
        const cidade = readline.question('Cidade: ');
        const cep = readline.question('CEP: ');

        enderecoEntrega = {
          rua,
          numero,
          bairro,
          cidade,
          cep
        };
        console.log('✅ Novo endereço cadastrado!');
      }
    } else {
      console.log('✅ Pedido para retirada no balcão!');
    }


    const observacoes = readline.question('Observações do pedido (opcional): ');

    try {
      const pedido = PedidoService.criarPedido({
        clienteId,
        itens,
        formaPagamento,
        observacoes: observacoes.trim() || undefined,
        enderecoEntrega
      });

      console.log('\n✅ Pedido criado com sucesso!');
      console.log(`ID do Pedido: ${pedido.id}`);
      console.log(`Total: R$ ${pedido.total.toFixed(2)}`);
      console.log(`Status: ${pedido.status}`);
    } catch (error: any) {
      console.log(`\nErro ao criar pedido: ${error.message}`);
    }
  }

  static listarPedidos(): void {
    console.log('\n=== LISTA DE PEDIDOS ===\n');

    const pedidos = PedidoService.listarPedidos();

    if (pedidos.length === 0) {
      console.log('Nenhum pedido encontrado.');
      return;
    }

    pedidos.forEach((pedido, index) => {
      console.log(`${index + 1}. Pedido ${pedido.id}`);
      console.log(`   Cliente: ${pedido.clienteId}`);
      console.log(`   Status: ${pedido.status}`);
      console.log(`   Total: R$ ${pedido.total.toFixed(2)}`);
      console.log(`   Data: ${pedido.dataPedido.toLocaleDateString('pt-BR')}`);
      console.log('---');
    });
  }

  static atualizarStatusPedido(): void {
    const readline = require('readline-sync');

    console.log('\n=== ATUALIZAR STATUS DO PEDIDO ===\n');

    const id = readline.question('ID do pedido: ');
    const pedido = PedidoService.buscarPedidoPorId(id);

    if (!pedido) {
      console.log('\nPedido não encontrado.');
      return;
    }

    console.log('\nPedido encontrado:');
    console.log(`ID: ${pedido.id}`);
    console.log(`Status atual: ${pedido.status}`);
    console.log(`Total: R$ ${pedido.total.toFixed(2)}`);

    console.log('\nStatus disponíveis:');
    console.log('1. Pendente');
    console.log('2. Preparando');
    console.log('3. Pronto');
    console.log('4. Entregue');
    console.log('5. Cancelado');

    const statusOpcao = readline.question('Escolha o novo status: ');
    let novoStatus: StatusPedido;

    switch (statusOpcao) {
      case '1':
        novoStatus = StatusPedido.PENDENTE;
        break;
      case '2':
        novoStatus = StatusPedido.PREPARANDO;
        break;
      case '3':
        novoStatus = StatusPedido.PRONTO;
        break;
      case '4':
        novoStatus = StatusPedido.ENTREGUE;
        break;
      case '5':
        novoStatus = StatusPedido.CANCELADO;
        break;
      default:
        console.log('Status inválido.');
        return;
    }

    try {
      const pedidoAtualizado = PedidoService.atualizarStatusPedido(id, novoStatus);
      if (pedidoAtualizado) {
        console.log('\nStatus do pedido atualizado com sucesso!');
        console.log(`Novo status: ${pedidoAtualizado.status}`);
      }
    } catch (error: any) {
      console.log(`\nErro ao atualizar status: ${error.message}`);
    }
  }

  static gerarRelatorioVendasDiario(): void {
    console.log('\n=== RELATÓRIO DE VENDAS DIÁRIO ===\n');

    const hoje = new Date();
    const relatorio = PedidoService.gerarRelatorioVendasDiario(hoje);

    console.log(`Data: ${relatorio.data.toLocaleDateString('pt-BR')}`);
    console.log(`Total de Pedidos: ${relatorio.totalPedidos}`);
    console.log(`Total de Vendas: R$ ${relatorio.totalVendas.toFixed(2)}`);
    console.log(`Pizzas Vendidas: ${relatorio.pizzasVendidas}`);
    console.log('\nPedidos por Status:');
    Object.entries(relatorio.pedidosPorStatus).forEach(([status, quantidade]) => {
      console.log(`  ${status}: ${quantidade}`);
    });
  }

  static gerarRelatorioVendasMensal(): void {
    const readline = require('readline-sync');

    console.log('\n=== RELATÓRIO DE VENDAS MENSAL ===\n');

    const ano = parseInt(readline.question('Ano: '));
    const mes = parseInt(readline.question('Mês (1-12): '));

    if (mes < 1 || mes > 12) {
      console.log('Mês inválido.');
      return;
    }

    const relatorio = PedidoService.gerarRelatorioVendasMensal(ano, mes);

    console.log(`\nRelatório de ${mes}/${ano}:`);
    console.log(`Total de Pedidos: ${relatorio.totalPedidos}`);
    console.log(`Total de Vendas: R$ ${relatorio.totalVendas.toFixed(2)}`);
    console.log(`Pizzas Vendidas: ${relatorio.pizzasVendidas}`);
    console.log('\nPedidos por Status:');
    Object.entries(relatorio.pedidosPorStatus).forEach(([status, quantidade]) => {
      console.log(`  ${status}: ${quantidade}`);
    });

    if (relatorio.vendasPorDia.length > 0) {
      console.log('\nVendas por Dia:');
      relatorio.vendasPorDia.forEach(dia => {
        console.log(`  Dia ${dia.dia}: R$ ${dia.vendas.toFixed(2)} (${dia.pizzas} pizzas)`);
      });
    }
  }
}


