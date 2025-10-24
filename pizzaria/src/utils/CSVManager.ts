import * as fs from 'fs';
import * as path from 'path';

export class CSVManager {
  private static dataDir = path.join(__dirname, '..', '..', 'data');

  static salvarDados<T>(nomeArquivo: string, dados: T[], headers: string[]): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      const caminhoArquivo = path.join(this.dataDir, `${nomeArquivo}.csv`);
      
      // Converter dados para CSV
      const csvContent = this.converterParaCSV(dados, headers);
      
      fs.writeFileSync(caminhoArquivo, csvContent, 'utf8');
    } catch (error) {
      console.error(`Erro ao salvar dados em ${nomeArquivo}.csv:`, error);
    }
  }

  static carregarDados<T>(nomeArquivo: string, converterLinha: (linha: string[]) => T): T[] {
    try {
      const caminhoArquivo = path.join(this.dataDir, `${nomeArquivo}.csv`);
      
      if (!fs.existsSync(caminhoArquivo)) {
        return [];
      }

      const conteudo = fs.readFileSync(caminhoArquivo, 'utf8');
      const linhas = conteudo.split('\n').filter(linha => linha.trim());
      
      if (linhas.length <= 1) {
        return []; // Apenas cabeçalho ou arquivo vazio
      }

      // Pular cabeçalho e converter linhas
      const dados = linhas.slice(1).map(linha => {
        const valores = this.parsearLinhaCSV(linha);
        return converterLinha(valores);
      });

      return dados;
    } catch (error) {
      console.error(`Erro ao carregar dados de ${nomeArquivo}.csv:`, error);
      return [];
    }
  }

  private static converterParaCSV<T>(dados: T[], headers: string[]): string {
    let csv = headers.join(',') + '\n';
    
    dados.forEach(item => {
      const valores = headers.map(header => {
        const valor = (item as any)[header];
        if (valor === null || valor === undefined) {
          return '';
        }
        
        // Se for string e contiver vírgula, aspas ou quebra de linha, colocar entre aspas
        if (typeof valor === 'string' && (valor.includes(',') || valor.includes('"') || valor.includes('\n'))) {
          return `"${valor.replace(/"/g, '""')}"`;
        }
        
        // Se for objeto (como endereço), converter para JSON
        if (typeof valor === 'object' && valor !== null) {
          return `"${JSON.stringify(valor).replace(/"/g, '""')}"`;
        }
        
        return valor.toString();
      });
      
      csv += valores.join(',') + '\n';
    });
    
    return csv;
  }

  private static parsearLinhaCSV(linha: string): string[] {
    const valores: string[] = [];
    let valorAtual = '';
    let dentroDeAspas = false;
    let i = 0;

    while (i < linha.length) {
      const char = linha[i];
      
      if (char === '"') {
        if (dentroDeAspas && linha[i + 1] === '"') {
          // Aspas duplas escapadas
          valorAtual += '"';
          i += 2;
        } else {
          // Inverter estado das aspas
          dentroDeAspas = !dentroDeAspas;
          i++;
        }
      } else if (char === ',' && !dentroDeAspas) {
        valores.push(valorAtual.trim());
        valorAtual = '';
        i++;
      } else {
        valorAtual += char;
        i++;
      }
    }
    
    valores.push(valorAtual.trim());
    return valores;
  }

  static inicializarArquivosCSV(): void {
    // Criar diretório de dados se não existir
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    // Criar arquivos CSV vazios se não existirem
    const arquivos = [
      { nome: 'clientes', headers: ['id', 'nome', 'email', 'telefone', 'endereco', 'dataCadastro', 'ativo'] },
      { nome: 'produtos', headers: ['id', 'nome', 'descricao', 'categoria', 'preco', 'tamanho', 'ingredientes', 'disponivel', 'dataCadastro'] },
      { nome: 'pedidos', headers: ['id', 'clienteId', 'itens', 'status', 'formaPagamento', 'subtotal', 'desconto', 'taxaEntrega', 'total', 'observacoes', 'dataPedido', 'dataEntrega', 'enderecoEntrega'] },
      { nome: 'promocoes', headers: ['id', 'nome', 'descricao', 'tipo', 'valor', 'valorMinimo', 'produtosAplicaveis', 'dataInicio', 'dataFim', 'ativa', 'limiteUsos'] }
    ];

    arquivos.forEach(arquivo => {
      const caminhoArquivo = path.join(this.dataDir, `${arquivo.nome}.csv`);
      if (!fs.existsSync(caminhoArquivo)) {
        fs.writeFileSync(caminhoArquivo, arquivo.headers.join(',') + '\n', 'utf8');
      }
    });
  }
}


