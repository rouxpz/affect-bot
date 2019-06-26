let posCats = ['nn', 'vb', 'jj', 'prp', 'rb', 'ex'];
let groups = [[], [], [], [], [], []];
let constructions = [['nn', 'vb', 'jj'], ['prp', 'vb', 'jj']];

function loadData() {
  request = new XMLHttpRequest();
  request.open('GET', 'python/corpus.json', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400){
      // Success!
      data = JSON.parse(request.responseText);

      for (var i = 0; i < data.length; i++) {
        var w = new Word(data[i].word, data[i].affects);

        var pos_array = data[i].pos;
        var pos_toAdd = [];

        for (var j = 0; j < pos_array.length; j++) {
          var pl = pos_array[j].toLowerCase();

          for (var k = 0; k < posCats.length; k++) {
            var index = pl.indexOf(posCats[k]);
            if (index != -1) {
              groups[k].push(w);
            }
          }

        }
      }

      // console.log(words.length);
      // console.log(words[0]);
      // console.log(groups);
    } else {
      // We reached our target server, but it returned an error
      console.log("error");
    }
  };

  request.send();
}

function changeAffect() {
  document.getElementById("pastStatements").innerHTML += '<br>' + document.getElementById("mainStatement").innerHTML;

  var currentText = '';
  var toAdd;
  var cs = Math.floor(Math.random() * constructions.length);
  var affects = document.getElementById("affects");

  for (var i = 0; i < constructions[cs].length; i++) {
    if (constructions[cs][i] === 'prp') {
      //select proper noun randomly
      toAdd = Math.floor(Math.random() * groups[3].length);
      currentText += groups[3][toAdd].text + ' ';
      console.log("proper noun");
    } else {
      //match affect
      var s = posCats.indexOf(constructions[cs][i]);
      var tempArray = [];
      // console.log(groups[s]);
      for (var j = 0; j < groups[s].length; j++) {
        if (groups[s][j].affects.indexOf(affects.value) != -1) {
          //temporary array to select from
          tempArray.push(groups[s][j].text);
          // console.log(posCats[s]);
          // console.log(groups[s][j].affects);
        }
      }
      // console.log(tempArray);
      if (tempArray.length > 0) {
        //randomly select word
        toAdd = Math.floor(Math.random() * tempArray.length);
        currentText += tempArray[toAdd] + ' ';
      } else {
        //randomly select from full array of POS
      }
    }
  }

  document.getElementById("mainStatement").innerHTML = currentText;
  // console.log(affects.value);
}


function Word(text, affects) {
  this.text = text;
  this.affects = affects;

}
