# Diagramas do Sistema de Pizzaria

Este documento contém os diagramas explicativos do sistema de gerenciamento de pizzaria.

## 1. Mapa Mental - Visão Geral do Sistema

```
                    SISTEMA DE PIZZARIA
                           |
        ┌─────────────────┼─────────────────┐
        |                 |                 |
    CLIENTES          PRODUTOS          PEDIDOS
        |                 |                 |
    ┌───┴───┐         ┌───┴───┐         ┌───┴───┐
    |       |         |       |         |       |
  Cadastro Listagem  Pizzas Bebidas   Criação Entrega
    |       |         |       |         |       |
  Busca   Edição    Sobremesas Acompanhamentos  Retirada Comprovante
    |       |         |       |         |       |
  Dados   Histórico  Preços  Categorias  Pagamento Relatórios
```

## 2. Arquitetura da Aplicação

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ MenuPrincipal   │  │ ClienteController│  │ProdutoCtrl  │ │
│  │                 │  │                 │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ PedidoController│  │ RelatorioCtrl   │  │Comprovante  │ │
│  │                 │  │                 │  │Generator    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE SERVIÇOS                      │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ ClienteService  │  │ ProdutoService  │  │PedidoService│ │
│  │                 │  │                 │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ PromocaoService │  │ CSVManager      │  │ IDManager   │ │
│  │                 │  │                 │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE DADOS                         │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ ClienteModel    │  │ ProdutoModel    │  │ PedidoModel │ │
│  │                 │  │                 │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ PromocaoModel   │  │ Arquivos CSV    │  │ Comprovantes│ │
│  │                 │  │                 │  │ (TXT)       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```




