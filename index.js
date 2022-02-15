let savedIdeas = []

function randomWord(wordType){
  let wordList = Object.keys(groupedList[wordType]);
  let randomIndex = Math.floor(Math.random() * wordList.length);
  let randomWord = wordList[randomIndex];
  $(`#${wordType}`).text(randomWord);
  return randomWord;
}

function findDefinition(wordType){
  let word = $(`#${wordType}`).text();
  $.ajax(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`).done((data) => {
    //Data is returned as array, so convert to Object
    let info = data[0]

    //Default definition
    let definitions = [{definition: "unknown"}];
    // console.log(definitions)

    let index = 0;
    while(index < info.meanings.length && definitions[0].definition == "unknown") {
        if(info.meanings[index].partOfSpeech === wordType) {
          definitions = info.meanings[index].definitions
        }
        index++;
    }
    let randomIndex = Math.floor(Math.random() * definitions.length);

    updateDefintion(word, wordType, definitions[randomIndex].definition, definitions[randomIndex].example)

    // console.log(definitions[randomIndex].definition)
    // console.log(definitions[randomIndex].example)
  })
}

function updateDefintion(word, wordType, definition, example) {
  $("#word-to-define").text(`${word} (${wordType})`);
  $("#definition-text").text(`${definition}`);
  $("#definition-example").text(`"${example || 'no definition available'}"`);
}

function newIdea(){
  randomWord('verb');
  randomWord('adjective');
  randomWord('noun');
}

function saveIdea(){
  let newIdea = []
  newIdea.push($('#verb').text())
  newIdea.push($('#adjective').text())
  newIdea.push($('#noun').text())
  savedIdeas.push(newIdea)
  createNewSavedRow(newIdea)
}

function createNewSavedRow(wordArray){
  let verb = wordArray[0]
  let adjective = wordArray[1]
  let noun = wordArray[2]
  let newTableRow = $('<tr></tr>')

  newTableRow.append(`<td class="col-md-4"><p>${verb}</p></td>`)
  newTableRow.append(`<td class="col-md-4"><p>${adjective}</p></td>`)
  newTableRow.append(`<td class="col-md-4"><p>${noun}</p></td>`)

  $('#savedIdeas').append(newTableRow);
}

function exportToCSV(){
  let csvContent = "data:text/csv;charset=utf-8,";
  savedIdeas.forEach(idea => {
    let row = idea.join(",");
    csvContent += `${row}\r\n`;
  });

  let date = new Date();
  let creationDate = date.toISOString().split('T')[0];

  let encodeUri = encodeURI(csvContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodeUri);
  link.setAttribute("download", `my-ideas-${creationDate}.csv`);
  document.body.appendChild(link);
  link.click();
}

function clearSavedIdeas() {
  savedIdeas = [];
  $('#savedIdeas').empty();
}
