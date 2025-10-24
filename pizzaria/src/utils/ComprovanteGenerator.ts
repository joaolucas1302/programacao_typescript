import { ProdutoModel } from '../models/Produto';

export class ComprovanteGenerator {
  static gerarComprovante(pedido: any, cliente: any): string {
    const dataPedido = new Date(pedido.dataPedido);
    const dataFormatada = dataPedido.toLocaleDateString('pt-BR');
    const horaFormatada = dataPedido.toLocaleTimeString('pt-BR');
    
    let comprovante = `
╔══════════════════════════════════════════════════════════════
║                     PIZZARIA DELÍCIA                     
║                   COMPROVANTE DE PEDIDO                     
╠══════════════════════════════════════════════════════════════
║ Pedido: ${pedido.id.toString().padEnd(48)} 
║ Data: ${dataFormatada.padEnd(50)} 
║ Hora: ${horaFormatada.padEnd(50)} 
╠══════════════════════════════════════════════════════════════
║ CLIENTE                                                      
╠══════════════════════════════════════════════════════════════
║ Nome: ${cliente.nome.padEnd(50)} 
║ Email: ${cliente.email.padEnd(50)} 
║ Telefone: ${cliente.telefone.padEnd(46)} 
╠══════════════════════════════════════════════════════════════
║ ITENS DO PEDIDO                                             
╠══════════════════════════════════════════════════════════════`;

    // Adicionar itens do pedido
    pedido.itens.forEach((item: any, index: number) => {
      const produto = ProdutoModel.buscarPorId(item.produtoId);
      const nomeProduto = produto ? produto.nome : 'Produto não encontrado';
      const precoItem = (item.precoUnitario * item.quantidade).toFixed(2);
      const linha = `║ ${index + 1}. ${nomeProduto.padEnd(25)} ${item.quantidade}x R$ ${precoItem.padStart(8)} ║`;
      comprovante += `\n${linha}`;
    });

    comprovante += `
╠══════════════════════════════════════════════════════════════
║ RESUMO DO PEDIDO                                            
╠══════════════════════════════════════════════════════════════
║ Subtotal: ${`R$ ${pedido.subtotal.toFixed(2)}`.padEnd(48)} 
║ Desconto: ${`R$ ${pedido.desconto.toFixed(2)}`.padEnd(48)} 
║ Taxa de Entrega: ${`R$ ${pedido.taxaEntrega.toFixed(2)}`.padEnd(42)} 
║ TOTAL: ${`R$ ${pedido.total.toFixed(2)}`.padEnd(50)} 
╠══════════════════════════════════════════════════════════════
║ Forma de Pagamento: ${pedido.formaPagamento.padEnd(38)} 
║ Status: ${pedido.status.padEnd(50)} `;

    // Informação de entrega/retirada
    if (pedido.enderecoEntrega) {
      comprovante += `
║ Tipo: ENTREGA ${' '.padEnd(45)} 
║ Endereço: ${`${pedido.enderecoEntrega.rua}, ${pedido.enderecoEntrega.numero}`.padEnd(40)} 
║ Bairro: ${pedido.enderecoEntrega.bairro.padEnd(45)} 
║ Cidade: ${pedido.enderecoEntrega.cidade.padEnd(45)} 
║ CEP: ${pedido.enderecoEntrega.cep.padEnd(48)} `;
    } else {
      comprovante += `
║ Tipo: RETIRADA NO BALCÃO ${' '.padEnd(35)} `;
    }

    if (pedido.observacoes) {
      comprovante += `
║ Observações: ${pedido.observacoes.padEnd(45)} `;
    }

    comprovante += `
╠══════════════════════════════════════════════════════════════
║                    Obrigado pela preferência!                
║                    Volte sempre!                           
╚══════════════════════════════════════════════════════════════`;

    return comprovante;
  }

  static salvarComprovante(comprovante: string, nomeArquivo: string): void {
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    
    // Salvar na área de trabalho
    const areaTrabalho = path.join(os.homedir(), 'Desktop');
    const caminhoArquivo = path.join(areaTrabalho, `${nomeArquivo}.txt`);
    
    try {
      fs.writeFileSync(caminhoArquivo, comprovante, 'utf8');
      console.log(`\nComprovante salvo na área de trabalho: ${caminhoArquivo}`);
    } catch (error) {
      console.log(`\nErro ao salvar comprovante: ${error}`);
    }
  }
}
