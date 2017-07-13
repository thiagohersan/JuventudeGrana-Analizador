var answers;
var filteredAnswers;
var myGraph;

var emotionDuos = [
  "a) Responsa x Zoeira",
  "b) Alegria x Tristeza",
  "c) Angústia x Tranquilidade",
  "d) Poder x Inferioridade",
  "e) Liberdade x Prisão",
  "f) Dependência x Independência",
  "g) Obrigação x Possibilidade",
  "h) Segurança x Insegurança",
  "i) Prazer x Desprazer",
  "j) Dominação x Submissão",
  "k) Conforto x Incômodo",
  "l) Acesso x Isolamento",
  "m) Solidão x Companhia",
  "n) Humildade x Ostentação",
  "o) Passado x Futuro",
  "p) Vontade x Realização"
];

var educationQuestions = [
  "5 - Qual seu grau de escolaridade? [Ensino fundamental incompleto]",
  "5 - Qual seu grau de escolaridade? [Ensino fundamental completo]",
  "5 - Qual seu grau de escolaridade? [Ensino médio incompleto]",
  "5 - Qual seu grau de escolaridade? [Ensino médio completo]",
  "5 - Qual seu grau de escolaridade? [Ensino superior incompleto]",
  "5 - Qual seu grau de escolaridade? [Ensino superior completo]",
  "5 - Qual seu grau de escolaridade? [Pós graduação]"
];

var filters = [
  "2- Qual a sua idade?",
  "4 - Qual é sua raça?",
  "Qual o seu gênero?",
  "10 - Quanto você ganha por mês?",
  "7 - Você se considera rico ou pobre?",
  "24 - Em qual estado emocional você gasta mais?",
  "Relacionamento emocional com dinheiro",
  "Educação - pública/particular",
  "Educação - último grau de escolaridade"
];

var questions = [
  "2- Qual a sua idade?",
  "4 - Qual é sua raça?",
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
  "23 - Qual uso do dinheiro te dá mais prazer?",
  "24 - Em qual estado emocional você gasta mais?",
  "25 - No seu orçamento mensal, R$ 100 faz:",
  "26 - Você já passou muita vontade de ter ou fazer algo e não pôde por causa de dinheiro?",
  "27 - Se você ganhar muita grana, mataria essa vontade independente do preço?",
  "28 - Na hora de pagar a conta do bar, você:",
  "29 - Como você avalia sua relação com dinheiro?",
  "30 - Com quem você aprendeu?",
  "32 - Você consegue juntar grana?",
  "33 - Você procura viver de modo a depender menos do dinheiro?",
  "A falta de dinheiro me impede de estar em lugares que eu gostaria de estar.",
  "Compro algo que está em promoção mesmo sem precisar.",
  "Dou mais valor para presentes que custaram caro.",
  "Educação - pública/particular",
  "Educação - último grau de escolaridade",
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
  "Sou mais criterioso para gastar a grana que ganhei trabalhando do que o dinheiro que veio fácil."
];

var questionForms = ['question-0', 'question-1'];

var pieGraphData = {
  type: "pie",
  indexLabelFontFamily: "Garamond",
  indexLabelFontSize: 20,
  indexLabel: "#percent%",
  startAngle: 0,
  showInLegend: true,
  toolTipContent:"{label}: {y}"
};

var columnGraphData = {
  type: "stackedColumn",
  showInLegend: true,
  legendText: "{legendText}",
  toolTipContent:"{legendText}: {y}"
};

function initializeGraph(){
  myGraph = new CanvasJS.Chart("chart-container", {
    title: {
      text: "",
      fontFamily: "Helvetica",
      fontSize: 32,
      fontWeight: "bolder"
    },
    legend: {
      verticalAlign: "center",
      horizontalAlign: "left",
      fontSize: 20,
      fontFamily: "Helvetica"
    },
    theme: "theme2",
    data: [pieGraphData]
  });
  myGraph.render();
}

window.onload = function() {
  loadJSON("data/20170712.json", function(json) {
    answers = processEducation(processEmotions(JSON.parse(json)));
    createFilterForms(createFilterOptions(filters, answers));
    filteredAnswers = processFilter(answers, getActiveFilterOptions());
    questions = questions.concat(emotionDuos);

    for(var i in questionForms) {
      createQuestionForm(questions, questionForms[i]);
    }

    initializeGraph();
  });
}

function createQuestionForm(questions, questionNameId) {
  var questionContainer = document.getElementById('question-container');

  var selectElement = document.createElement('select');
  selectElement.setAttribute('name', questionNameId);
  selectElement.setAttribute('id', questionNameId);
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

  questionContainer.appendChild(selectElement);
}

function orderKeys(obj) {
  var ordered = [];
  for(var k in obj) {
    ordered.push(k);
  }
  ordered.sort(function(a, b) {
    return (a > b) ? 1 : -1;
  });
  return ordered;
}

function isObject(obj) {
  return obj === Object(obj);
}

function createAnswersCounter(tree, possibleAnswers) {
  var theseAnswers = possibleAnswers[0];

  for(var i in theseAnswers) {
    var thisAnswer = theseAnswers[i];
    if(possibleAnswers.length == 1) {
      tree[thisAnswer] = 0;
    } else {
      tree[thisAnswer] = createAnswersCounter({}, possibleAnswers.slice(1));
    }
  }

  return tree;
}

function getPossibleAnswers(selectedQuestions, answers) {
  var possibleAnswers = [];

  for(var q = (selectedQuestions.length - 1); q >= 0; q--) {
    var thisQuestion = selectedQuestions[q];
    var thisQuestionsPossibleAnswers = {};

    for(var p in answers) {
      var thisPerson = answers[p];
      thisQuestionsPossibleAnswers[thisPerson[thisQuestion]] = 0;
    }

    possibleAnswers.push(Object.keys(thisQuestionsPossibleAnswers));
  }

  return possibleAnswers;
}

function countAnswers(selectedQuestions, answers) {
  var dataCounter = createAnswersCounter({}, getPossibleAnswers(selectedQuestions, answers));

  for(var p in answers) {
    var thisDataSet = dataCounter;

    for(var q = (selectedQuestions.length - 1); q >= 0; q--) {
      var thisQuestion = selectedQuestions[q];
      var thisAnswer = answers[p][thisQuestion];

      if(q == 0) {
        thisDataSet[thisAnswer] += 1;
      }

      thisDataSet = thisDataSet[thisAnswer];
    }
  }

  return dataCounter;
}

function create2dDataSets(dataCounter) {
  var data = [];
  var orderedAnswers = orderKeys(dataCounter);

  for(var i in orderedAnswers) {
    var yAxis = orderedAnswers[i];

    if(isObject(dataCounter[yAxis])) {
      var thisDataSet = [];
      for(var xAxis in dataCounter[yAxis]) {
        thisDataSet.push({ y: dataCounter[yAxis][xAxis], legendText: yAxis, label: xAxis });
      }
      thisDataSet.sort(function(a, b) {
        return (a.label > b.label) ? 1 : -1;
      });
      data.push(thisDataSet);
    } else {
      data[0] = data[0] || [];
      data[0].push({ y: dataCounter[yAxis], legendText: yAxis, label: yAxis });
    }
  }
  return data;
}

function processQuestions(selectedQuestions, answers) {
  var dataCounter = countAnswers(selectedQuestions, answers);
  var data = create2dDataSets(dataCounter);
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
    nullOption.innerHTML = i.replace(/^[0-9]+ ?\- /g,'');
    selectElement.appendChild(nullOption);

    filterOptions[i].sort();

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
  
  document.getElementById('record-counter').innerHTML = "Número de respostas: "+filteredData.length;
  return filteredData;
}

function updateFilter() {
  filteredAnswers = processFilter(answers, getActiveFilterOptions());
  drawGraph();
}

function getSelectedQuestions() {
  var selectedQuestions = [];
  for(var i in questionForms) {
    var thisQuestion = document.getElementById(questionForms[i]).value;
    if(thisQuestion != "null"){
      selectedQuestions.push(thisQuestion);
    }
  }
  return selectedQuestions;
}

function drawGraph() {
  var selectedQuestions = getSelectedQuestions();
  var chartTitle = "";
  var dataSets = [[]];

  var relativeCheckbox = document.getElementById('relative-comparison');

  if(selectedQuestions.length > 0) {
    dataSets = processQuestions(selectedQuestions, filteredAnswers);
  }

  for(var i in selectedQuestions) {
    chartTitle += " ❤ "+selectedQuestions[i];
  }
  myGraph.title.set('text', chartTitle.substr(3), false);

  if(selectedQuestions.length > 1) {
    myGraph.set('data', []);
    for(var i in dataSets) {
      myGraph.addTo('data', JSON.parse(JSON.stringify(columnGraphData)));
      myGraph.data[i].set('dataPoints', dataSets[i]);
      if(relativeCheckbox.checked) {
        myGraph.data[i].set('type', 'stackedColumn100');
      }
    }
  } else {
    myGraph.set('data', [pieGraphData]);
    myGraph.data[0].set('dataPoints', dataSets[0]);
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
    for(var q in emotionDuos) {
      if(positiveWords.indexOf(answers[i][emotionDuos[q]]) > -1) {
        positiveCount++;
      }
    }

    var relacionamento = (positiveCount >= (positiveWords.length / 2)) ? 'Positivo' : 'Negativo';
    answers[i]['Relacionamento emocional com dinheiro'] = relacionamento;
  }

  return answers;
}

function processEducation(answers) {
  for(var i in answers) {
    var person = answers[i];
    for(var j in educationQuestions) {
      var question = educationQuestions[j];
      var cleanQuestion = question.match(/\[.+\]/g)[0].slice(1,-1);
      if(person[question].search('pública') > -1) {
        person['Educação - pública/particular'] = 'Pública';
        person['Educação - último grau de escolaridade'] = cleanQuestion;
      } else if(person[question].search('particular') > -1) {
        person['Educação - pública/particular'] = 'Particular';
        person['Educação - último grau de escolaridade'] = cleanQuestion;
      }
    }
  }

  return answers;
}
