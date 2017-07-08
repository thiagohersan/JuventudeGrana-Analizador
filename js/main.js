var answers;
var filteredAnswers;
var filterOptions;

var filters = [
  "Relacionamento com Dinheiro",
  "24 - Em qual estado emocional você gasta mais?",
  "2- Qual a sua idade?",
  "4 - Qual é sua raça?",
  "Qual o seu gênero?"
];

window.onload = function() {
  loadJSON("data/baby.json", function(json) {
    answers = processEmotions(JSON.parse(json));
    filterOptions = createFilterOptions(filters, answers);
    createFilterForms(filterOptions);
    filteredAnswers = processFilter(answers, getActiveFilterOptions());
  });

  // create dropdown for questions
  // create graphs
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
    answers[i]['Relacionamento com Dinheiro'] = relacionamento;
  }

  return answers;
}
