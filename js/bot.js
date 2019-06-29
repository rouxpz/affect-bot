let posCats = ['nn', 'vb', 'jj', 'prp', 'rb', 'ex'];
let affectList = ['anger', 'anticipation', 'joy', 'surprise', 'sadness', 'disgust', 'fear', 'trust']
let groups = [[], [], [], [], [], []];
let sentenceGroups = [[], [], [], [], [], [], [], []];
var txt, toFill, intv, markovFill;
let scripts = ['script-1', 'script-2']

//sentence constructions here by part of speech -- can be much more detailed!
let constructions = [['prp', 'vb', 'rb', 'jj', 'nn']];

function loadData() {
  request = new XMLHttpRequest();
  request.open('GET', 'python/corpus.json', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400){
      // Success!
      data = JSON.parse(request.responseText);

      for (var i = 0; i < data.length; i++) {

        //***PARSING DATA FOR MARKOV CHAIN OPTION - USE corpus-s.json FOR THIS INSTEAD***
        // var s = new Word(data[i].sentence, data[i].affects);
        // console.log(s);
        //
        // for (var j = 0; j < affectList.length; j++) {
        //   for (var k = 0; k < data[i].affects.length; k++) {
        //     if (affectList[j] === data[i].affects[k]) {
        //       sentenceGroups[j].push(data[i].sentence)
        //     }
        //   }
        // }

        // console.log(sentenceGroups);
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

  for (var i = 0; i < scripts.length; i++) {
    var client = new XMLHttpRequest();
    client.open('GET', 'python/' + scripts[i] + '.txt');
    client.onreadystatechange = function() {
      txt += client.responseText.trim();
      // console.log(txt);
    }
    client.send();
  }
}

function changeAffect() {
  document.getElementById("reset").style.display = "inline-block";
  document.getElementById("pastStatements").innerHTML += '<br>' +  document.getElementById("mainStatement").innerHTML;

  toFill = '';
  var currentText = [];
  var toAdd;
  var cs = Math.floor(Math.random() * constructions.length);
  var affects = document.getElementById("affects");
  var continuation = Math.floor(Math.random() * 5);

  for (var i = 0; i < constructions[cs].length; i++) {
    // for (var i = 0; i < 3; i++) {
    if (constructions[cs][i] === 'prp') {
      //select proper noun randomly
      toAdd = Math.floor(Math.random() * groups[3].length);
      currentText.push(groups[3][toAdd].text);
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
        currentText.push(tempArray[toAdd]);
      } else {
        //randomly select from full array of POS
        toAdd = Math.floor(Math.random() * groups[3].length);
        currentText.push(groups[s][toAdd].text);
      }
    }
  }

  // console.log(currentText);
  for (var i = 0; i < currentText.length; i++) {
    toFill += ' ' + currentText[i];
  }

  console.log(toFill);

  //***MARKOV CHAIN OPTION***
  // var affectAll;
  // for (var i = 0; i < affectList.length; i++) {
  //   if (affects.value === affectList[i]) {
  //     affectAll = sentenceGroups[i].join(' ');
  //     console.log(affectAll);
  //   }
  // }
  //
  // rm = new RiMarkov(3);
  // rm.loadText(affectAll);
  // markovFill = rm.generateSentence();

  document.getElementById("mainStatement").innerHTML = toFill;


}


function Word(text, affects) {
  this.text = text;
  this.affects = affects;

}

function switchAffect() {
  intv = setInterval(changeAffect, 5000);
  document.getElementById("selection").style.display = "none";
}

function resetAffect() {
  clearInterval(intv);
  document.getElementById("selection").style.display = "inline-block";
  document.getElementById("reset").style.display = "none";
}
