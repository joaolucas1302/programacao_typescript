import { Cliente, ClienteModel } from '../models/Cliente';

export class ClienteService {
  static cadastrarCliente(dadosCliente: Omit<Cliente, 'id' | 'dataCadastro' | 'ativo'>): Cliente {
    // Validar se o email já existe
    const clienteExistente = ClienteModel.buscarPorEmail(dadosCliente.email);
    if (clienteExistente) {
      throw new Error('Já existe um cliente cadastrado com este email');
    }

    // Validar dados obrigatórios
    this.validarDadosCliente(dadosCliente);

    const cliente = ClienteModel.adicionar({
      ...dadosCliente,
      ativo: true
    });

    return cliente;
  }

  static listarClientes(): Cliente[] {
    return ClienteModel.buscarTodos();
  }

  static buscarClientePorId(id: string): Cliente | null {
    const cliente = ClienteModel.buscarPorId(id);
    return cliente || null;
  }

  static buscarClientePorEmail(email: string): Cliente | null {
    const cliente = ClienteModel.buscarPorEmail(email);
    return cliente || null;
  }

  static atualizarCliente(id: string, dadosAtualizacao: Partial<Omit<Cliente, 'id' | 'dataCadastro'>>): Cliente | null {
    // Verificar se o cliente existe
    const clienteExistente = ClienteModel.buscarPorId(id);
    if (!clienteExistente) {
      throw new Error('Cliente não encontrado');
    }

    // Se estiver atualizando o email, verificar se não existe outro cliente com o mesmo email
    if (dadosAtualizacao.email && dadosAtualizacao.email !== clienteExistente.email) {
      const clienteComEmail = ClienteModel.buscarPorEmail(dadosAtualizacao.email);
      if (clienteComEmail) {
        throw new Error('Já existe um cliente cadastrado com este email');
      }
    }

    // Validar dados se fornecidos
    if (dadosAtualizacao.nome || dadosAtualizacao.email || dadosAtualizacao.telefone) {
      this.validarDadosCliente({
        nome: dadosAtualizacao.nome || clienteExistente.nome,
        email: dadosAtualizacao.email || clienteExistente.email,
        telefone: dadosAtualizacao.telefone || clienteExistente.telefone,
        endereco: dadosAtualizacao.endereco || clienteExistente.endereco
      });
    }

    return ClienteModel.atualizar(id, dadosAtualizacao);
  }

  static excluirCliente(id: string): boolean {
    const cliente = ClienteModel.buscarPorId(id);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    return ClienteModel.excluir(id);
  }

  private static validarDadosCliente(dados: Partial<Cliente>): void {
    if (!dados.nome || dados.nome.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }

    if (!dados.email || !this.validarEmail(dados.email)) {
      throw new Error('Email inválido');
    }

    if (!dados.telefone || !this.validarTelefone(dados.telefone)) {
      throw new Error('Telefone inválido');
    }

    if (dados.endereco) {
      this.validarEndereco(dados.endereco);
    }
  }

  private static validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  private static validarTelefone(telefone: string): boolean {
    const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return regex.test(telefone);
  }

  private static validarEndereco(endereco: any): void {
    if (!endereco.rua || endereco.rua.trim().length < 3) {
      throw new Error('Rua deve ter pelo menos 3 caracteres');
    }

    if (!endereco.numero || endereco.numero.trim().length < 1) {
      throw new Error('Número é obrigatório');
    }

    if (!endereco.bairro || endereco.bairro.trim().length < 2) {
      throw new Error('Bairro deve ter pelo menos 2 caracteres');
    }

    if (!endereco.cidade || endereco.cidade.trim().length < 2) {
      throw new Error('Cidade deve ter pelo menos 2 caracteres');
    }

    if (!endereco.cep || !this.validarCEP(endereco.cep)) {
      throw new Error('CEP inválido');
    }
  }

  private static validarCEP(cep: string): boolean {
    const regex = /^\d{5}-?\d{3}$/;
    return regex.test(cep);
  }
}


