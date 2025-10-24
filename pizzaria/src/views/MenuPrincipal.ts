import { ClienteController } from '../controllers/ClienteController';
import { ProdutoController } from '../controllers/ProdutoController';
import { PedidoController } from '../controllers/PedidoController';
import { PromocaoController } from '../controllers/PromocaoController';
import { PromocaoService } from '../services/PromocaoService';

export class MenuPrincipal {
  private static readline = require('readline-sync');

  static exibirMenu(): void {
    console.log('\n' + '='.repeat(50));
    console.log('SISTEMA DE PIZZARIA');
    console.log('='.repeat(50));
    console.log('\n1. Gerenciar Clientes');
    console.log('2. Gerenciar Produtos');
    console.log('3. Gerenciar Pedidos');
    console.log('4. Gerenciar Promoções');
    console.log('5. Relatórios de Vendas');
    console.log('6. Sair');
    console.log('\n' + '='.repeat(50));
  }

  static exibirMenuClientes(): void {
    console.log('\n' + '='.repeat(30));
    console.log('GERENCIAR CLIENTES');
    console.log('='.repeat(30));
    console.log('\n1. Cadastrar Cliente');
    console.log('2. Listar Clientes');
    console.log('3. Buscar Cliente');
    console.log('4. Atualizar Cliente');
    console.log('5. Excluir Cliente');
    console.log('6. Voltar ao Menu Principal');
    console.log('\n' + '='.repeat(30));
  }

  static exibirMenuProdutos(): void {
    console.log('\n' + '='.repeat(30));
    console.log('GERENCIAR PRODUTOS');
    console.log('='.repeat(30));
    console.log('\n1. Cadastrar Produto');
    console.log('2. Listar Produtos');
    console.log('3. Listar Pizzas');
    console.log('4. Buscar Produto');
    console.log('5. Atualizar Produto');
    console.log('6. Excluir Produto');
    console.log('7. Voltar ao Menu Principal');
    console.log('\n' + '='.repeat(30));
  }

  static exibirMenuPedidos(): void {
    console.log('\n' + '='.repeat(30));
    console.log('GERENCIAR PEDIDOS');
    console.log('='.repeat(30));
    console.log('\n1. Criar Pedido');
    console.log('2. Listar Pedidos');
    console.log('3. Atualizar Status do Pedido');
    console.log('4. Voltar ao Menu Principal');
    console.log('\n' + '='.repeat(30));
  }

  static exibirMenuPromocoes(): void {
    console.log('\n' + '='.repeat(30));
    console.log('GERENCIAR PROMOÇÕES');
    console.log('='.repeat(30));
    console.log('\n1. Cadastrar Promoção');
    console.log('2. Listar Promoções');
    console.log('3. Listar Promoções Ativas');
    console.log('4. Buscar Promoção');
    console.log('5. Ativar/Desativar Promoção');
    console.log('6. Voltar ao Menu Principal');
    console.log('\n' + '='.repeat(30));
  }

  static exibirMenuRelatorios(): void {
    console.log('\n' + '='.repeat(30));
    console.log('RELATÓRIOS DE VENDAS');
    console.log('='.repeat(30));
    console.log('\n1. Relatório Diário');
    console.log('2. Relatório Mensal');
    console.log('3. Voltar ao Menu Principal');
    console.log('\n' + '='.repeat(30));
  }

  static executar(): void {
    // Inicializar promoções padrão
    PromocaoService.criarPromocoesPadrao();

    let executando = true;

    while (executando) {
      this.exibirMenu();
      const opcao = this.readline.question('Escolha uma opção: ');

      switch (opcao) {
        case '1':
          this.executarMenuClientes();
          break;
        case '2':
          this.executarMenuProdutos();
          break;
        case '3':
          this.executarMenuPedidos();
          break;
        case '4':
          this.executarMenuPromocoes();
          break;
        case '5':
          this.executarMenuRelatorios();
          break;
        case '6':
          console.log('\nObrigado por usar o Sistema de Pizzaria!');
          executando = false;
          break;
        default:
          console.log('\n❌ Opção inválida. Tente novamente.');
      }
    }
  }

  private static executarMenuClientes(): void {
    let executando = true;

    while (executando) {
      this.exibirMenuClientes();
      const opcao = this.readline.question('Escolha uma opção: ');

      switch (opcao) {
        case '1':
          try {
            ClienteController.cadastrarCliente();
          } catch (error) {
            // Erro já foi tratado no controller
          }
          break;
        case '2':
          ClienteController.listarClientes();
          break;
        case '3':
          ClienteController.buscarCliente();
          break;
        case '4':
          ClienteController.atualizarCliente();
          break;
        case '5':
          ClienteController.excluirCliente();
          break;
        case '6':
          executando = false;
          break;
        default:
          console.log('\n❌ Opção inválida. Tente novamente.');
      }

      if (executando) {
        this.readline.question('\nPressione Enter para continuar...');
      }
    }
  }

  private static executarMenuProdutos(): void {
    let executando = true;

    while (executando) {
      this.exibirMenuProdutos();
      const opcao = this.readline.question('Escolha uma opção: ');

      switch (opcao) {
        case '1':
          try {
            ProdutoController.cadastrarProduto();
          } catch (error) {
            // Erro já foi tratado no controller
          }
          break;
        case '2':
          ProdutoController.listarProdutos();
          break;
        case '3':
          ProdutoController.listarPizzas();
          break;
        case '4':
          ProdutoController.buscarProduto();
          break;
        case '5':
          ProdutoController.atualizarProduto();
          break;
        case '6':
          ProdutoController.excluirProduto();
          break;
        case '7':
          executando = false;
          break;
        default:
          console.log('\n❌ Opção inválida. Tente novamente.');
      }

      if (executando) {
        this.readline.question('\nPressione Enter para continuar...');
      }
    }
  }

  private static executarMenuPedidos(): void {
    let executando = true;

    while (executando) {
      this.exibirMenuPedidos();
      const opcao = this.readline.question('Escolha uma opção: ');

      switch (opcao) {
        case '1':
          try {
            PedidoController.criarPedido();
          } catch (error) {
            // Erro já foi tratado no controller
          }
          break;
        case '2':
          PedidoController.listarPedidos();
          break;
        case '3':
          PedidoController.atualizarStatusPedido();
          break;
        case '4':
          executando = false;
          break;
        default:
          console.log('\n❌ Opção inválida. Tente novamente.');
      }

      if (executando) {
        this.readline.question('\nPressione Enter para continuar...');
      }
    }
  }

  private static executarMenuPromocoes(): void {
    let executando = true;

    while (executando) {
      this.exibirMenuPromocoes();
      const opcao = this.readline.question('Escolha uma opção: ');

      switch (opcao) {
        case '1':
          try {
            PromocaoController.cadastrarPromocao();
          } catch (error) {
            // Erro já foi tratado no controller
          }
          break;
        case '2':
          PromocaoController.listarPromocoes();
          break;
        case '3':
          PromocaoController.listarPromocoesAtivas();
          break;
        case '4':
          PromocaoController.buscarPromocao();
          break;
        case '5':
          PromocaoController.ativarDesativarPromocao();
          break;
        case '6':
          executando = false;
          break;
        default:
          console.log('\n❌ Opção inválida. Tente novamente.');
      }

      if (executando) {
        this.readline.question('\nPressione Enter para continuar...');
      }
    }
  }

  private static executarMenuRelatorios(): void {
    let executando = true;

    while (executando) {
      this.exibirMenuRelatorios();
      const opcao = this.readline.question('Escolha uma opção: ');

      switch (opcao) {
        case '1':
          PedidoController.gerarRelatorioVendasDiario();
          break;
        case '2':
          PedidoController.gerarRelatorioVendasMensal();
          break;
        case '3':
          executando = false;
          break;
        default:
          console.log('\n❌ Opção inválida. Tente novamente.');
      }

      if (executando) {
        this.readline.question('\nPressione Enter para continuar...');
      }
    }
  }
}


