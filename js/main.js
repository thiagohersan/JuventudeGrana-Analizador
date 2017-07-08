var answers;
var filteredAnswers;

var filters = [
  "Relacionamento emocional com dinheiro",
  "24 - Em qual estado emocional você gasta mais?",
  "2- Qual a sua idade?",
  "4 - Qual é sua raça?",
  "Qual o seu gênero?"
];

var questions = [
  "7 - Você se considera rico ou pobre?",
  "8 - Você ajuda a pagar as contas da sua casa?",
  "9 - Quem é o principal responsável por bancar a sua casa?",
  "10 - Quanto você ganha por mês?",
  "11 - Como você ganha a sua grana?",
  "12 - Você tem filh@?",
  "13 - Você tem conta bancária?",
  "14 - Você possui alguma dívida?",
  "15 - Quantas vezes por mês você usa cartão de crédito?",
  "16 - Quantas vezes por mês você faz compras pela internet?",
  "20 - Dessas categorias, em quais você não faz questão de economizar?",
  "21 - Dessas categorias, em quais você gastaria mais se seu salário fosse 4 vezes maior?",
  "22 - Que problemas você resolveria se seu salário fosse 4 vezes maior?",
  "23 - Qual uso do dinheiro te dá mais prazer?",
  "24 - Em qual estado emocional você gasta mais?",
  "25 - No seu orçamento mensal, R$ 100 faz:",
  "26 - Você já passou muita vontade de ter ou fazer algo e não pôde por causa de dinheiro?",
  "27 - Se você ganhar muita grana, mataria essa vontade independente do preço?",
  "28 - Na hora de pagar a conta do bar, você:",
  "29 - Como você avalia sua relação com dinheiro?",
  "30 - Com quem você aprendeu?",
  "31 - O que você têm mais dificuldade de entender no sistema bancário?",
  "32 - Você consegue juntar grana?",
  "33 - Você procura viver de modo a depender menos do dinheiro?",
  "34 - Quais desses meios alternativos você usa?",
  "A falta de dinheiro me impede de estar em lugares que eu gostaria de estar.",
  "Compro algo que está em promoção mesmo sem precisar.",
  "Dou mais valor para presentes que custaram caro.",
  "Eu tenho medo de lidar com grana.",
  "Gosto mais de uma coisa comprada nova do que algo trocado de graça.",
  "Jovens que trabalham e têm responsabilidade sobre a renda familiar têm mais noção do valor do dinheiro.",
  "Me considero viciad@ em dinheiro.",
  "Me sinto sem controle diante do dinheiro e do sistema bancário.",
  "Não gosto de falar sobre grana com ninguém.",
  "Não me importo em gastar muito com um presente legal para alguém.",
  "Não me importo em me endividar para ter algo que quero muito.",
  "Não ter dinheiro me dá vergonha.",
  "É impossível ser feliz sem grana.",
  "Sou mais criterioso para gastar a grana que ganhei trabalhando do que o dinheiro que veio fácil.",
  "a)",
  "b)",
  "c)",
  "d)",
  "e)",
  "f)",
  "g)",
  "h)",
  "i)",
  "j)",
  "k)",
  "l)",
  "m)",
  "n)",
  "o)",
  "p)"
];

window.onload = function() {
  loadJSON("data/baby.json", function(json) {
    answers = processEmotions(JSON.parse(json));
    createFilterForms(createFilterOptions(filters, answers));
    filteredAnswers = processFilter(answers, getActiveFilterOptions());
    createQuestionForm(questions, 'question-x');
  });

  // create graphs
}

function createQuestionForm(questions, elementId) {
  var selectElement = document.getElementById(elementId);
  selectElement.setAttribute('onchange', 'drawGraph()');
  selectElement.innerHTML = '';

  var nullOption = document.createElement('option');
  nullOption.setAttribute('value', 'null');
  nullOption.innerHTML = 'Escolha a pergunta';
  selectElement.appendChild(nullOption);

  for(var q in questions) {
    var thisOption = document.createElement('option');
    thisOption.setAttribute('value', questions[q]);
    thisOption.innerHTML = questions[q];
    selectElement.appendChild(thisOption);
  }
}

function processQuestion(question, answers) {
  var data = {};

  for(p in answers) {
    var thisAnswer = answers[p][question];
    if(data.hasOwnProperty(thisAnswer)) {
      data[thisAnswer] += 1;
    } else {
      data[thisAnswer] = 1;
    }
  }
  return data;
}

function createFilterOptions(filters, answers) {
  var filterOptions = {};

  for(var i in filters) {
    filterOptions[filters[i]] = {};
  }

  for(var i in answers) {
    var person = answers[i];
    for(var j in filters) {
      var question = filters[j];
      var thisAnswer = person[question];

      if(thisAnswer && thisAnswer != '') {
        filterOptions[question][thisAnswer] = 0;
      }
    }
  }

  for(var i in filters) {
    filterOptions[filters[i]] = Object.keys(filterOptions[filters[i]]);
  }

  return filterOptions;
}

function createFilterForms(filterOptions) {
  var filterContainer = document.getElementById('filter-form-container');
  filterContainer.innerHTML = '';

  for(var i in filterOptions) {
    var selectElement = document.createElement('select');
    selectElement.setAttribute('name', i);
    selectElement.setAttribute('onchange', 'updateFilter()');

    var nullOption = document.createElement('option');
    nullOption.setAttribute('value', "null");
    nullOption.innerHTML = i;
    selectElement.appendChild(nullOption);

    for(var j in filterOptions[i]) {
      var thisOption = document.createElement('option');
      thisOption.setAttribute('value', filterOptions[i][j]);
      thisOption.innerHTML = filterOptions[i][j];
      selectElement.appendChild(thisOption);
    }

    filterContainer.appendChild(selectElement);
  }
}

function getActiveFilterOptions() {
  var filterContainer = document.getElementById('filter-form-container');
  var filterForms = filterContainer.getElementsByTagName('select');

  var activeFilters = {};

  for(var f=0; f < filterForms.length; f++) {
    if(filterForms[f].value != "null") {
      activeFilters[filterForms[f].getAttribute('name')] = filterForms[f].value;
    }
  }
  return activeFilters;
}

function processFilter(data, filterOptions) {
  var filteredData = [];

  for(var p in data) {
    var person = data[p];
    var pushPerson = true;
    for(var f in filterOptions) {
      var activeOption = filterOptions[f];
      var personsAnswer = person[f];
      pushPerson = pushPerson && (activeOption == personsAnswer);
    }

    if(pushPerson) {
      filteredData.push(person);
    }
  }
  
  document.getElementById('record-counter').innerHTML = filteredData.length;
  return filteredData;
}

function updateFilter() {
  filteredAnswers = processFilter(answers, getActiveFilterOptions());
  drawGraph();
}

function drawGraph() {
  var values;
  var question = document.getElementById('question-x').value;
  if(question != "null") {
    values = processQuestion(question, filteredAnswers);
    console.log(values);
  }
}

function processEmotions(answers) {
  var positiveWords = [
    "Responsa", "Alegria", "Tranquilidade", "Poder", "Liberdade", "Independência",
    "Possibilidade", "Segurança", "Prazer", "Dominação", "Conforto", "Acesso",
    "Companhia", "Humildade", "Futuro", "Realização"
  ];

  for(var i in answers) {
    var positiveCount = 0;
    for(var q='a'.charCodeAt(0); q<='p'.charCodeAt(0); q++) {
      if(positiveWords.indexOf(answers[i][String.fromCharCode(q)+')']) > -1) {
        positiveCount++;
      }
    }

    var relacionamento = (positiveCount >= (positiveWords.length / 2)) ? 'Positivo' : 'Negativo';
    answers[i]['Relacionamento emocional com dinheiro'] = relacionamento;
  }

  return answers;
}
