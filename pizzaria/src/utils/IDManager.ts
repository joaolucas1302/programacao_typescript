export class IDManager {
  private static contadores: Map<string, number> = new Map();

  static gerarId(tipo: string): string {
    const contadorAtual = this.contadores.get(tipo) || 0;
    const novoContador = contadorAtual + 1;
    this.contadores.set(tipo, novoContador);
    
    // Retorna apenas o número sequencial (1, 2, 3, 4, 5, 6...)
    return novoContador.toString();
  }

  static definirContador(tipo: string, valor: number): void {
    this.contadores.set(tipo, valor);
  }

  static obterContador(tipo: string): number {
    return this.contadores.get(tipo) || 0;
  }

  static inicializarContadores(): void {
    // Os contadores serão inicializados quando os dados forem carregados
    this.contadores.set('cliente', 0);
    this.contadores.set('produto', 0);
    this.contadores.set('pedido', 0);
    this.contadores.set('promocao', 0);
  }
}




