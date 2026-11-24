export type QuestionCategory =
  | 'Lógica de Programação'
  | 'JavaScript'
  | 'Pensamento Computacional';

export interface QuizQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  code?: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export const QUESTION_BANK: QuizQuestion[] = [
  {
    id: 'logic-1',
    category: 'Lógica de Programação',
    question: 'O que será exibido no console ao executar este trecho de código?',
    code: `let idade = 16;\nlet temIngresso = true;\n\nif (idade >= 18 && temIngresso) {\n  console.log("Entrada liberada");\n} else {\n  console.log("Entrada bloqueada");\n}`,
    options: [
      'Entrada bloqueada',
      'Entrada liberada',
      'true',
      'Erro de sintaxe',
    ],
    correctIndex: 0,
    explanation:
      'O operador lógico E (&&) exige que todas as condições sejam verdadeiras. Como idade (16) não é maior ou igual a 18, o bloco else é executado.',
  },
  {
    id: 'logic-2',
    category: 'Lógica de Programação',
    question: 'Qual será o valor final da variável soma após o término do laço?',
    code: `let soma = 0;\nfor (let i = 1; i <= 4; i++) {\n  soma = soma + i;\n}`,
    options: ['6', '10', '14', '4'],
    correctIndex: 1,
    explanation:
      'O laço executa com i valendo 1, 2, 3 e 4. Somando passo a passo: 0 + 1 + 2 + 3 + 4 resulta em 10.',
  },
  {
    id: 'logic-3',
    category: 'Lógica de Programação',
    question: 'Na programação, qual expressão verifica corretamente se um número inteiro n é par?',
    options: [
      'n % 2 === 0',
      'n / 2 === 0',
      'n % 2 === 1',
      'n * 2 === 0',
    ],
    correctIndex: 0,
    explanation:
      'O operador módulo (%) retorna o resto da divisão inteira. Todo número par dividido por 2 deixa resto igual a 0.',
  },
  {
    id: 'logic-4',
    category: 'Lógica de Programação',
    question: 'Em uma condição lógica (A || B) usando o operador OU, em qual situação o resultado final será falso?',
    options: [
      'Apenas quando A e B forem falsos',
      'Quando A for verdadeiro e B for falso',
      'Quando apenas um dos dois valores for falso',
      'Sempre que A e B tiverem valores diferentes',
    ],
    correctIndex: 0,
    explanation:
      'Com o operador OU (||), basta que pelo menos uma condição seja verdadeira para o resultado ser verdadeiro. Ele só resulta em falso se ambas forem falsas.',
  },
  {
    id: 'logic-5',
    category: 'Lógica de Programação',
    question: 'Temos a = 5 e b = 9. Por que precisamos de uma variável auxiliar (temp) ao trocar os valores entre a e b?',
    options: [
      'Para não perder o valor original de uma variável ao sobrescrevê-la',
      'Porque números inteiros não podem ser copiados diretamente',
      'Para transformar os números em texto antes da troca',
      'Porque a memória apaga a variável logo após a primeira leitura',
    ],
    correctIndex: 0,
    explanation:
      'Se fizermos a = b diretamente, o valor 5 de a é sobrescrito e perdido. Guardar a em temp antes permite completar a troca com segurança.',
  },
  {
    id: 'logic-6',
    category: 'Lógica de Programação',
    question: 'O que acontece quando escrevemos um laço while cuja condição nunca se torna falsa?',
    options: [
      'O programa entra em loop infinito e trava a execução',
      'O navegador interrompe o laço automaticamente após 10 voltas',
      'A variável contadora volta para zero sozinha',
      'O código executa o bloco apenas uma vez e segue adiante',
    ],
    correctIndex: 0,
    explanation:
      'Sem atualizar a condição para que ela se torne falsa em algum momento, o laço repete indefinidamente, consumindo processamento sem encerrar.',
  },
  {
    id: 'js-1',
    category: 'JavaScript',
    question: 'O que será impresso no console pelo código JavaScript abaixo?',
    code: `console.log(5 === "5");\nconsole.log(5 == "5");`,
    options: [
      'false e true',
      'true e true',
      'false e false',
      'true e false',
    ],
    correctIndex: 0,
    explanation:
      'O operador === (igualdade estrita) compara valor e tipo (number !== string, logo false). Já == faz coerção de tipo antes de comparar, retornando true.',
  },
  {
    id: 'js-2',
    category: 'JavaScript',
    question: 'Em JavaScript, qual é a principal característica de uma variável declarada com const?',
    options: [
      'Ela não pode receber uma nova reatribuição após ser inicializada',
      'Ela só pode guardar números e nunca aceita textos ou listas',
      'Ela é apagada da memória assim que a função termina de carregar',
      'Ela só funciona no escopo global fora de blocos condicionais',
    ],
    correctIndex: 0,
    explanation:
      'Variáveis declaradas com const criam uma referência constante: você não pode reatribuir outro valor a ela usando o sinal de =.',
  },
  {
    id: 'js-3',
    category: 'JavaScript',
    question: 'Qual será o conteúdo do array aprovadas após executar este código?',
    code: `const notas = [4, 8, 6, 9, 5];\nconst aprovadas = notas.filter(n => n >= 7);`,
    options: ['[8, 9]', '[4, 6, 5]', '[true, false]', '2'],
    correctIndex: 0,
    explanation:
      'O método filter() cria um novo array contendo apenas os elementos que passaram no teste lógico (n >= 7), ou seja, 8 e 9.',
  },
  {
    id: 'js-4',
    category: 'JavaScript',
    question: 'Qual palavra será exibida no console ao acessar a posição 2 do array?',
    code: `const linguagens = ["HTML", "CSS", "JavaScript", "Python"];\nconsole.log(linguagens[2]);`,
    options: ['"JavaScript"', '"CSS"', '"Python"', '"HTML"'],
    correctIndex: 0,
    explanation:
      'Em JavaScript, os índices de um array começam em 0: índice 0 é "HTML", índice 1 é "CSS" e índice 2 é "JavaScript".',
  },
  {
    id: 'js-5',
    category: 'JavaScript',
    question: 'Qual é o valor e o tipo armazenado na variável resultado?',
    code: `const resultado = "10" + 5;`,
    options: [
      '"105" (string)',
      '15 (number)',
      'NaN (number)',
      '"15" (string)',
    ],
    correctIndex: 0,
    explanation:
      'Quando o operador + encontra uma string, o JavaScript converte o número 5 em texto e realiza uma concatenação, resultando em "105".',
  },
  {
    id: 'js-6',
    category: 'JavaScript',
    question: 'Qual é o comportamento do método map() neste trecho de código?',
    code: `const numeros = [2, 4, 6];\nconst dobros = numeros.map(x => x * 2);`,
    options: [
      'Retorna um novo array [4, 8, 12] sem alterar o array original',
      'Retorna a soma total dos elementos multiplicados, igual a 24',
      'Modifica apenas o primeiro item da lista original para 4',
      'Retorna o número 3 indicando quantos itens existem no array',
    ],
    correctIndex: 0,
    explanation:
      'O método map() percorre todos os itens, aplica a função transformadora em cada um e devolve um novo array do mesmo tamanho.',
  },
  {
    id: 'comp-1',
    category: 'Pensamento Computacional',
    question: 'No Pensamento Computacional, o que significa aplicar o pilar da Decomposição?',
    options: [
      'Dividir um problema complexo em partes menores e mais fáceis de resolver',
      'Ignorar partes importantes do problema para escrever menos linhas',
      'Executar instruções aleatórias até encontrar uma resposta aceitável',
      'Decorar trechos de código prontos sem compreender sua lógica',
    ],
    correctIndex: 0,
    explanation:
      'Decompor consiste em quebrar um grande desafio em subproblemas independentes e gerenciáveis, facilitando o desenvolvimento e os testes.',
  },
  {
    id: 'comp-2',
    category: 'Pensamento Computacional',
    question: 'Um mapa de metrô mostra apenas estações e linhas de conexão, omitindo prédios e ruas da cidade. Qual pilar do pensamento computacional isso exemplifica?',
    options: [
      'Abstração',
      'Compilação',
      'Iteração infinita',
      'Ordenação reversa',
    ],
    correctIndex: 0,
    explanation:
      'A abstração filtra os detalhes irrelevantes e destaca apenas as informações essenciais para resolver o problema em questão.',
  },
  {
    id: 'comp-3',
    category: 'Pensamento Computacional',
    question: 'Por que o Reconhecimento de Padrões é fundamental ao projetar soluções computacionais?',
    options: [
      'Permite identificar semelhanças entre problemas e reutilizar soluções eficientes',
      'Serve exclusivamente para escolher paletas de cores em sites',
      'Elimina a necessidade de testar programas antes da entrega',
      'Impede que funções recebam parâmetros variáveis',
    ],
    correctIndex: 0,
    explanation:
      'Ao notar comportamentos que se repetem, podemos criar funções reutilizáveis e prever resultados com muito mais rapidez.',
  },
  {
    id: 'comp-4',
    category: 'Pensamento Computacional',
    question: 'Você quer achar um nome específico em uma lista ordenada alfabeticamente com 1.000 nomes. Qual estratégia encontra o nome em muito menos passos?',
    options: [
      'Busca binária: verificar o meio da lista e descartar a metade errada',
      'Busca linear: ler todos os nomes do primeiro ao último em sequência',
      'Busca aleatória: escolher posições sorteadas até dar sorte',
      'Busca reversa: ler sempre da última posição até a primeira',
    ],
    correctIndex: 0,
    explanation:
      'A busca binária corta o espaço de busca pela metade a cada comparação. Em 1.000 itens ordenados, ela encontra qualquer nome em no máximo 10 tentativas!',
  },
  {
    id: 'comp-5',
    category: 'Pensamento Computacional',
    question: 'Qual definição descreve com mais precisão o conceito de Algoritmo?',
    options: [
      'Uma sequência finita e bem definida de passos para resolver um problema',
      'Qualquer arquivo salvo no computador com a extensão .js ou .html',
      'Uma falha inesperada que fecha um aplicativo durante o uso',
      'Um chip físico instalado na placa-mãe para acelerar gráficos',
    ],
    correctIndex: 0,
    explanation:
      'Um algoritmo é um roteiro lógico, finito e sem ambiguidades que transforma entradas em saídas esperadas — como uma receita passo a passo.',
  },
  {
    id: 'comp-6',
    category: 'Pensamento Computacional',
    question: 'Seu código calcula a média errada porque faltaram parênteses em (nota1 + nota2) / 2. Como chamamos o processo de investigar e corrigir essa falha?',
    options: [
      'Depuração (Debugging)',
      'Criptografia',
      'Minificação',
      'Renderização',
    ],
    correctIndex: 0,
    explanation:
      'Depuração (debugging) é a prática sistemática de rastrear, entender e corrigir erros lógicos ou de execução em um algoritmo.',
  },
];

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function shuffleQuestionOptions(q: QuizQuestion): QuizQuestion {
  const tagged = q.options.map((text, idx) => ({
    text,
    isCorrect: idx === q.correctIndex,
  }));
  const shuffled = shuffleArray(tagged);
  const newCorrectIndex = shuffled.findIndex((item) => item.isCorrect) as
    | 0
    | 1
    | 2
    | 3;
  return {
    ...q,
    options: [
      shuffled[0].text,
      shuffled[1].text,
      shuffled[2].text,
      shuffled[3].text,
    ],
    correctIndex: newCorrectIndex,
  };
}

/**
 * Seleciona 10 perguntas equilibradas entre Lógica de Programação,
 * JavaScript e Pensamento Computacional, embaralhando perguntas e alternativas.
 */
export function pickMatchQuestions(): QuizQuestion[] {
  const logic = shuffleArray(
    QUESTION_BANK.filter((q) => q.category === 'Lógica de Programação')
  );
  const js = shuffleArray(
    QUESTION_BANK.filter((q) => q.category === 'JavaScript')
  );
  const comp = shuffleArray(
    QUESTION_BANK.filter((q) => q.category === 'Pensamento Computacional')
  );

  const selected = [
    ...logic.slice(0, 3),
    ...js.slice(0, 3),
    ...comp.slice(0, 3),
  ];

  const remainingPool = shuffleArray([
    ...logic.slice(3),
    ...js.slice(3),
    ...comp.slice(3),
  ]);

  selected.push(remainingPool[0]);

  return shuffleArray(selected).map(shuffleQuestionOptions);
}
