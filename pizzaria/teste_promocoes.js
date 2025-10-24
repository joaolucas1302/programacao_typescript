const { PromocaoController } = require('./dist/controllers/PromocaoController');
const { PromocaoModel } = require('./dist/models/Promocao');

console.log('=== TESTE DA INTERFACE DE PROMOÇÕES ===\n');

// Simular entrada do usuário para teste
const readline = require('readline-sync');

console.log('1. Testando cadastro de promoção...\n');

// Simular dados de entrada
const mockInput = [
  'Promoção de Natal', // nome
  'Desconto especial de Natal', // descrição
  '1', // tipo: desconto percentual
  '15', // valor: 15%
  '50', // valor mínimo: R$ 50
  'n', // não aplicar a produtos específicos
  '01/12/2024', // data início
  '31/12/2024', // data fim
  '3', // limite de usos: 3 por cliente
  's' // ativa
];

let inputIndex = 0;

// Mock do readline.question
const originalQuestion = readline.question;
readline.question = function(prompt) {
  console.log(prompt + mockInput[inputIndex]);
  return mockInput[inputIndex++];
};

try {
  // Testar cadastro
  PromocaoController.cadastrarPromocao();
  
  console.log('\n2. Testando listagem de promoções...\n');
  PromocaoController.listarPromocoes();
  
  console.log('\n3. Testando listagem de promoções ativas...\n');
  PromocaoController.listarPromocoesAtivas();
  
  console.log('\n4. Testando busca de promoção...\n');
  readline.question = function(prompt) {
    console.log(prompt + 'Natal');
    return 'Natal';
  };
  PromocaoController.buscarPromocao();
  
} catch (error) {
  console.log('Erro no teste:', error.message);
} finally {
  // Restaurar função original
  readline.question = originalQuestion;
}

console.log('\n=== TESTE CONCLUÍDO ===');
