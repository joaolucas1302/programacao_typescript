import { MenuPrincipal } from './views/MenuPrincipal';
import { CSVManager } from './utils/CSVManager';
import { IDManager } from './utils/IDManager';
import { ClienteModel } from './models/Cliente';
import { ProdutoModel } from './models/Produto';
import { PedidoModel } from './models/Pedido';
import { PromocaoModel } from './models/Promocao';

// Função principal
function main() {
  try {
    console.log('🚀 Iniciando Sistema de Pizzaria...\n');
    
    // Inicializar sistema de dados
    CSVManager.inicializarArquivosCSV();
    IDManager.inicializarContadores();
    
    // Inicializar modelos
    ClienteModel.inicializar();
    ProdutoModel.inicializar();
    PedidoModel.inicializar();
    PromocaoModel.inicializar();
    
    console.log('Sistema inicializado com sucesso!');
    console.log('Dados:');
    console.log(`   Clientes: ${ClienteModel.buscarTodos().length}`);
    console.log(`   Produtos: ${ProdutoModel.buscarTodos().length}`);
    console.log(`   Pedidos: ${PedidoModel.buscarTodos().length}`);
    console.log(`   Promoções: ${PromocaoModel.buscarTodas().length}\n`);
    
    // Executar o menu principal
    MenuPrincipal.executar();
  } catch (error) {
    console.error('❌ Erro fatal no sistema:', error);
    process.exit(1);
  }
}

// Executar o sistema
main();
