import { ClienteService } from '../services/ClienteService';
import { Cliente } from '../models/Cliente';

export class ClienteController {
  static cadastrarCliente(): Cliente {
    const readline = require('readline-sync');

    console.log('\n=== CADASTRO DE CLIENTE ===\n');

    const nome = readline.question('Nome completo: ');
    const email = readline.question('Email: ');
    const telefone = readline.question('Telefone (formato: (11) 99999-9999): ');

    console.log('\n--- Endereço ---');
    const rua = readline.question('Rua: ');
    const numero = readline.question('Número: ');
    const bairro = readline.question('Bairro: ');
    const cidade = readline.question('Cidade: ');
    const cep = readline.question('CEP (formato: 12345-678): ');

    try {
      const cliente = ClienteService.cadastrarCliente({
        nome,
        email,
        telefone,
        endereco: {
          rua,
          numero,
          bairro,
          cidade,
          cep
        }
      });

      console.log('\nCliente cadastrado com sucesso!');
      console.log(`ID: ${cliente.id}`);
      return cliente;
    } catch (error: any) {
      console.log(`\nErro ao cadastrar cliente: ${error.message}`);
      throw error;
    }
  }

  static listarClientes(): void {
    console.log('\n=== LISTA DE CLIENTES ===\n');

    const clientes = ClienteService.listarClientes();

    if (clientes.length === 0) {
      console.log('Nenhum cliente cadastrado.');
      return;
    }

    clientes.forEach((cliente, index) => {
      console.log(`${index + 1}. ${cliente.nome}`);
      console.log(`   Email: ${cliente.email}`);
      console.log(`   Telefone: ${cliente.telefone}`);
      console.log(`   Endereço: ${cliente.endereco.rua}, ${cliente.endereco.numero} - ${cliente.endereco.bairro}, ${cliente.endereco.cidade}`);
      console.log(`   Data de Cadastro: ${cliente.dataCadastro.toLocaleDateString('pt-BR')}`);
      console.log('---');
    });
  }

  static buscarCliente(): Cliente | null {
    const readline = require('readline-sync');

    console.log('\n=== BUSCAR CLIENTE ===\n');
    console.log('1. Buscar por ID');
    console.log('2. Buscar por Email');
    const opcao = readline.question('Escolha uma opção: ');

    let cliente: Cliente | null = null;

    switch (opcao) {
      case '1':
        const id = readline.question('ID do cliente: ');
        cliente = ClienteService.buscarClientePorId(id);
        break;
      case '2':
        const email = readline.question('Email do cliente: ');
        cliente = ClienteService.buscarClientePorEmail(email);
        break;
      default:
        console.log('Opção inválida.');
        return null;
    }

    if (cliente) {
      console.log('\nCliente encontrado:');
      console.log(`Nome: ${cliente.nome}`);
      console.log(`Email: ${cliente.email}`);
      console.log(`Telefone: ${cliente.telefone}`);
      console.log(`Endereço: ${cliente.endereco.rua}, ${cliente.endereco.numero} - ${cliente.endereco.bairro}, ${cliente.endereco.cidade}`);
      console.log(`Data de Cadastro: ${cliente.dataCadastro.toLocaleDateString('pt-BR')}`);
    } else {
      console.log('\nCliente não encontrado.');
    }

    return cliente;
  }

  static atualizarCliente(): void {
    const readline = require('readline-sync');

    console.log('\n=== ATUALIZAR CLIENTE ===\n');

    const id = readline.question('ID do cliente: ');
    const cliente = ClienteService.buscarClientePorId(id);

    if (!cliente) {
      console.log('\nCliente não encontrado.');
      return;
    }

    console.log('\nCliente encontrado:');
    console.log(`Nome: ${cliente.nome}`);
    console.log(`Email: ${cliente.email}`);
    console.log(`Telefone: ${cliente.telefone}`);

    console.log('\nDeixe em branco para manter o valor atual.\n');

    const novoNome = readline.question(`Novo nome [${cliente.nome}]: `);
    const novoEmail = readline.question(`Novo email [${cliente.email}]: `);
    const novoTelefone = readline.question(`Novo telefone [${cliente.telefone}]: `);

    const dadosAtualizacao: any = {};
    if (novoNome.trim()) dadosAtualizacao.nome = novoNome;
    if (novoEmail.trim()) dadosAtualizacao.email = novoEmail;
    if (novoTelefone.trim()) dadosAtualizacao.telefone = novoTelefone;

    try {
      const clienteAtualizado = ClienteService.atualizarCliente(id, dadosAtualizacao);
      if (clienteAtualizado) {
        console.log('\nCliente atualizado com sucesso!');
      }
    } catch (error: any) {
      console.log(`\nErro ao atualizar cliente: ${error.message}`);
    }
  }

  static excluirCliente(): void {
    const readline = require('readline-sync');

    console.log('\n=== EXCLUIR CLIENTE ===\n');

    const id = readline.question('ID do cliente: ');
    const cliente = ClienteService.buscarClientePorId(id);

    if (!cliente) {
      console.log('\nCliente não encontrado.');
      return;
    }

    console.log('\nCliente encontrado:');
    console.log(`Nome: ${cliente.nome}`);
    console.log(`Email: ${cliente.email}`);

    const confirmacao = readline.question('Tem certeza que deseja excluir este cliente? (s/n): ');

    if (confirmacao.toLowerCase() === 's') {
      try {
        const sucesso = ClienteService.excluirCliente(id);
        if (sucesso) {
          console.log('\nCliente excluído com sucesso!');
        }
      } catch (error: any) {
        console.log(`\nErro ao excluir cliente: ${error.message}`);
      }
    } else {
      console.log('\nOperação cancelada.');
    }
  }
}


