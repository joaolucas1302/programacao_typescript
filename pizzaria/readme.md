# Sistema de Pizzaria

Sistema de gerenciamento para pizzarias desenvolvido em TypeScript com interface de linha de comando.

## 📋 Funcionalidades

- **Gestão de Clientes**: Cadastro, listagem e busca de clientes
- **Gestão de Produtos**: Catálogo de produtos com categorias
- **Gestão de Pedidos**: Criação de pedidos com cálculo automático
- **Sistema de Promoções**: Aplicação automática de descontos
- **Comprovantes**: Geração automática de comprovantes em TXT
- **Relatórios**: Análise de vendas e dados

## 🏗️ Arquitetura

O sistema segue uma arquitetura em camadas:

```
┌─────────────────┐
│   Controllers   │ ← Interface com usuário
├─────────────────┤
│    Services     │ ← Lógica de negócio
├─────────────────┤
│     Models      │ ← Entidades de dados
├─────────────────┤
│     Utils       │ ← Utilitários
└─────────────────┘
```

## 🚀 Instalação

### Pré-requisitos
- Node.js (versão 14+)
- npm

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/joaolucas1302/pizzaria_type.git
   cd pizzaria_type
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

## 📁 Estrutura do Projeto

```
src/
├── controllers/          # Controladores
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
├── views/               # Interface
│   └── MenuPrincipal.ts
└── index.ts            # Arquivo principal

data/                   # Dados persistentes
├── clientes.csv
├── produtos.csv
├── pedidos.csv
└── promocoes.csv
```

## 🛠️ Scripts Disponíveis

- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Executa a aplicação
- `npm run dev` - Executa em modo desenvolvimento
- `npm test` - Executa os testes

## 📊 Tecnologias Utilizadas

- **TypeScript** - Linguagem de programação
- **Node.js** - Runtime JavaScript
- **CSV** - Persistência de dados
- **readline-sync** - Interface de linha de comando

## 💾 Persistência de Dados

O sistema utiliza arquivos CSV para armazenamento:
- `clientes.csv` - Dados dos clientes
- `produtos.csv` - Catálogo de produtos
- `pedidos.csv` - Histórico de pedidos
- `promocoes.csv` - Promoções ativas

## 🎯 Como Usar

1. **Inicie o sistema**
   ```bash
   npm start
   ```

2. **Navegue pelo menu**
   - Gerenciar Clientes
   - Gerenciar Produtos
   - Gerenciar Pedidos
   - Relatórios

3. **Crie um pedido**
   - Selecione o cliente
   - Adicione produtos
   - Escolha entrega ou retirada
   - Confirme o pedido

4. **Comprovante gerado automaticamente**
   - Salvo na área de trabalho
   - Formato: `comprovante_pedido_[ID]_[data].txt`

## 🔧 Configuração

O sistema está configurado para funcionar imediatamente após a instalação. Não são necessárias configurações adicionais.

### Personalização
- Nome da pizzaria: Edite `ComprovanteGenerator.ts`
- Dados de contato: Modifique as constantes no gerador de comprovantes

## 📈 Funcionalidades Avançadas

### Sistema de Promoções
- Desconto por valor mínimo
- Promoções em produtos específicos
- Aplicação automática durante o pedido

### Relatórios
- Vendas por período
- Produtos mais vendidos
- Análise de clientes

### Validações
- Email válido
- CEP com 8 dígitos
- Preços positivos
- Campos obrigatórios

## 🐛 Solução de Problemas

### Erro de compilação
```bash
npm run build
```

### Dados não carregam
- Verifique se os arquivos CSV existem em `data/`
- Verifique a formatação dos arquivos

### Comprovante não é gerado
- Verifique permissões na área de trabalho
- Confirme se o pedido foi salvo

## 📚 Documentação

- [Manual de Utilização](docs/manual.md) - Guia completo de uso
- [Diagramas](docs/diagrams.md) - Diagramas explicativos


## 👥 Autores

- Cauã Zavanella da Encarnação
- Gabriel Henrique Lopes Costa
- João Lucas Frangiotti
