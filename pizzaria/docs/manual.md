# Manual de Utilização - Sistema de Pizzaria

## 1. Visão Geral

O Sistema de Pizzaria é uma aplicação de linha de comando desenvolvida em TypeScript para gerenciar operações de uma pizzaria, incluindo cadastro de clientes, produtos, criação de pedidos e geração de comprovantes.

### Funcionalidades Principais
- **Gestão de Clientes**: Cadastro, listagem e busca de clientes
- **Gestão de Produtos**: Cadastro e listagem de produtos (pizzas, bebidas, etc.)
- **Gestão de Pedidos**: Criação de pedidos com cálculo automático de totais
- **Sistema de Promoções**: Aplicação automática de descontos
- **Comprovantes**: Geração automática de comprovantes em arquivo TXT
- **Persistência de Dados**: Armazenamento em arquivos CSV

## 2. Estrutura do Projeto

```
src/
├── controllers/          # Controladores da aplicação
│   ├── ClienteController.ts
│   ├── ProdutoController.ts
│   ├── PedidoController.ts
│   └── RelatorioController.ts
├── models/              # Modelos de dados
│   ├── Cliente.ts
│   ├── Produto.ts
│   ├── Pedido.ts
│   └── Promocao.ts
├── services/            # Serviços de negócio
│   ├── ClienteService.ts
│   ├── ProdutoService.ts
│   ├── PedidoService.ts
│   └── PromocaoService.ts
├── utils/               # Utilitários
│   ├── CSVManager.ts
│   ├── IDManager.ts
│   └── ComprovanteGenerator.ts
├── views/               # Interface do usuário
│   └── MenuPrincipal.ts
└── index.ts            # Arquivo principal

data/                   # Arquivos de dados
├── clientes.csv
├── produtos.csv
├── pedidos.csv
└── promocoes.csv
```

## 3. Dependências

### Principais Dependências
- **TypeScript**: Linguagem de programação
- **Node.js**: Runtime JavaScript
- **@types/node**: Tipagens do Node.js
- **ts-node**: Execução direta de TypeScript
- **readline-sync**: Interface de linha de comando interativa

### Dependências de Desenvolvimento
- **typescript**: Compilador TypeScript
- **jest**: Framework de testes
- **@types/jest**: Tipagens do Jest

## 4. Instalação e Execução

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes)

### Passos de Instalação

1. **Clone ou baixe o projeto**
   ```bash
   cd pasta-do-projeto
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Compile o projeto**
   ```bash
   npm run build
   ```

4. **Execute a aplicação**
   ```bash
   npm start
   ```

### Scripts Disponíveis
- `npm run build`: Compila o TypeScript para JavaScript
- `npm start`: Executa a aplicação
- `npm run dev`: Executa em modo desenvolvimento
- `npm test`: Executa os testes

## 5. Como Usar o Sistema

### Menu Principal
Ao iniciar a aplicação, você verá o menu principal com as seguintes opções:

```
=== SISTEMA DE PIZZARIA ===
1. Gerenciar Clientes
2. Gerenciar Produtos
3. Gerenciar Pedidos
4. Relatórios
5. Sair
```

### 5.1 Gerenciar Clientes

**Cadastrar Cliente:**
1. Selecione a opção "1. Gerenciar Clientes"
2. Escolha "1. Cadastrar Cliente"
3. Preencha os dados solicitados:
   - Nome completo
   - Email
   - Telefone
   - Endereço (rua, número, bairro, cidade, CEP)

**Listar Clientes:**
- Selecione "2. Listar Clientes" para ver todos os clientes cadastrados

**Buscar Cliente:**
- Use "3. Buscar Cliente" para encontrar um cliente específico por nome ou email

### 5.2 Gerenciar Produtos

**Cadastrar Produto:**
1. Selecione "2. Gerenciar Produtos"
2. Escolha "1. Cadastrar Produto"
3. Preencha:
   - Nome do produto
   - Descrição
   - Categoria (Pizza, Bebida, Sobremesa, etc.)
   - Preço
   - Tamanho (se aplicável)
   - Ingredientes (para pizzas)

**Listar Produtos:**
- Use "2. Listar Produtos" para ver o cardápio completo

### 5.3 Gerenciar Pedidos

**Criar Pedido:**
1. Selecione "3. Gerenciar Pedidos"
2. Escolha "1. Criar Pedido"
3. Siga o fluxo:
   - Selecione ou cadastre o cliente
   - Adicione produtos ao pedido
   - Escolha a forma de pagamento
   - Defina se é entrega ou retirada
   - Confirme o pedido

**O sistema automaticamente:**
- Calcula o total
- Aplica promoções disponíveis
- Gera um comprovante
- Salva o pedido

### 5.4 Relatórios

**Relatório de Vendas:**
- Visualize vendas por período
- Veja produtos mais vendidos
- Analise dados de clientes

## 6. Estrutura de Dados

### Cliente
```typescript
{
  id: string;           // ID sequencial (1, 2, 3...)
  nome: string;         // Nome completo
  email: string;        // Email válido
  telefone: string;     // Telefone de contato
  endereco: {           // Endereço completo
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
  };
  dataCadastro: Date;   // Data de cadastro
  ativo: boolean;       // Status ativo/inativo
}
```

### Produto
```typescript
{
  id: string;           // ID sequencial
  nome: string;         // Nome do produto
  descricao: string;    // Descrição detalhada
  categoria: string;    // Categoria do produto
  preco: number;        // Preço unitário
  tamanho?: string;     // Tamanho (P, M, G)
  ingredientes: string[]; // Lista de ingredientes
  disponivel: boolean;  // Disponibilidade
  dataCadastro: Date;   // Data de cadastro
}
```

### Pedido
```typescript
{
  id: string;           // ID sequencial
  clienteId: string;    // ID do cliente
  itens: ItemPedido[];  // Lista de itens
  status: string;       // Status do pedido
  formaPagamento: string; // Forma de pagamento
  subtotal: number;     // Subtotal
  desconto: number;     // Desconto aplicado
  taxaEntrega: number;  // Taxa de entrega
  total: number;        // Total final
  dataPedido: Date;     // Data do pedido
  enderecoEntrega?: Endereco; // Endereço de entrega
}
```

## 7. Validações e Regras de Negócio

### Validações de Cliente
- Email deve ter formato válido
- Telefone deve conter apenas números
- CEP deve ter 8 dígitos
- Nome é obrigatório

### Validações de Produto
- Preço deve ser maior que zero
- Nome é obrigatório
- Categoria deve ser selecionada

### Validações de Pedido
- Cliente deve existir
- Deve ter pelo menos um item
- Total deve ser maior que zero
- Para entrega, endereço é obrigatório

## 8. Sistema de Promoções

O sistema aplica automaticamente promoções baseadas em:
- **Valor mínimo**: Desconto por valor mínimo de pedido
- **Produtos específicos**: Desconto em produtos selecionados
- **Período**: Promoções com data de início e fim

## 9. Comprovantes

### Geração Automática
- Comprovante é gerado automaticamente após criação do pedido
- Salvo na área de trabalho do usuário
- Formato: `comprovante_pedido_[ID]_[data].txt`

### Conteúdo do Comprovante
- Dados da pizzaria
- Informações do cliente
- Detalhes do pedido
- Itens e quantidades
- Valores e totais
- Tipo de entrega/retirada
- Data e hora

## 10. Persistência de Dados

### Arquivos CSV
- **clientes.csv**: Dados dos clientes
- **produtos.csv**: Catálogo de produtos
- **pedidos.csv**: Histórico de pedidos
- **promocoes.csv**: Promoções ativas

### Backup e Recuperação
- Dados são salvos automaticamente após cada operação
- Arquivos CSV podem ser editados manualmente se necessário
- Sistema carrega dados automaticamente na inicialização

## 11. Solução de Problemas

### Problemas Comuns

**Erro de compilação:**
```bash
npm run build
```

**Dados não carregam:**
- Verifique se os arquivos CSV existem na pasta `data/`
- Verifique a formatação dos arquivos CSV

**Comprovante não é gerado:**
- Verifique permissões de escrita na área de trabalho
- Verifique se o pedido foi salvo corretamente

**IDs duplicados:**
- Execute o sistema para recalcular contadores
- Verifique integridade dos arquivos CSV

### Logs e Debug
- Mensagens de erro são exibidas no console
- Verifique a pasta `data/` para integridade dos arquivos
- Use `npm run dev` para modo de desenvolvimento

