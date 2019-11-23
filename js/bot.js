let posCats = ['nn', 'vb', 'jj', 'prp', 'rb', 'ex', 'to', 'dt']; //add more POS here as you see fit
let affectList = ['anger', 'anticipation', 'joy', 'surprise', 'sadness', 'disgust', 'fear', 'trust']
let groups = [[], [], [], [], [], [], [], []]; //make sure this length is the same as posCats!
let sentenceGroups = [[], [], [], [], [], [], [], []]; //make sure this length is the same as affectList!
var txt = '';
var splitText;
var toFill, intv, markovFill;

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
      console.log(groups);
      console.log(sentenceGroups);
    } else {
      // We reached our target server, but it returned an error
      console.log("error");
    }
  };

  request.send();

  // loading data for Markov chains
  var client = new XMLHttpRequest();
  client.open('GET', 'python/files/bot-text.txt');
  client.onreadystatechange = function() {
    txt += client.responseText.trim();
    // console.log(txt);
    splitText = txt.split('.');
    // console.log(splitText[splitText.length-1]);
  }
  client.send();
}

function changeAffect() {
  var b = document.getElementsByClassName("showOnGenerate");
  // console.log(b[0]);

  for(var i = 0; i < b.length; i++) {
    b[i].style.display = "inline-block";
  }

  var affects = document.getElementById("affects");

  var toFill = '';
  var toChooseFrom = [];

  for (var i = 0; i < 50; i++) {
    var selection = Math.floor(Math.random(splitText.length) * splitText.length);
    toChooseFrom.push(splitText[selection]);
  }

  baseSentence = toChooseFrom.join(". ");
  baseSentence = baseSentence.replace('"', '').replace('(', '').replace(')', '');
  // console.log(baseSentence);
  rm = new RiMarkov(3);
  // rm.loadTokens(wordsAlone);
  rm.loadText(baseSentence);
  markovFill = rm.generateSentence();
  // markovFill = "He ate the apple."
  wordArray = RiTa.tokenize(markovFill.toLowerCase());
  mTags = compendium.analyse(markovFill)[0].tags;

  for (var i = 0; i < mTags.length-1; i++) {
    var toSelect = [];
    mTags[i] = mTags[i].toLowerCase();
    if (posCats.indexOf(mTags[i]) != -1) {
      // console.log("in list " + mTags[i]);
      var p = posCats.indexOf(mTags[i]);
      for (var j = 0; j < groups[p].length; j++) {

        var a = affectList.indexOf(affects.value);
        if (groups[p][j].affects.includes(affectList[a])) {
          toSelect.push(groups[p][j].text);
        }

      }

      if (toSelect.length > 0) {
        var si = Math.floor(Math.random()*toSelect.length);
        // console.log('CHOSEN WORD: ' + toSelect[si]);
        toFill += toSelect[si] + " ";
      } else {
        var si = Math.floor(Math.random() * groups[p].length);
        // console.log('CHOSEN TEXT: ' + groups[p][si].text);
        toFill += groups[p][si].text + " ";
      }
    } else {
      // console.log("skipped");
      toFill += wordArray[i] + " ";
    }
  }

  console.log(toFill);
  toFill = toFill.replace('“', '').replace('"', '').replace('"', '').replace('”', '').replace('(', '').replace(')', '');
  console.log(toFill);
  // console.log(markovFill);
  // console.log(mTags.length);
  // console.log(wordArray.length);

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

  var b = document.getElementsByClassName("showOnGenerate");
  // console.log(b[0]);

  for(var i = 0; i < b.length; i++) {
    b[i].style.display = "none";
  }
}

function saveSentence() {
  console.log("clicked");
  document.getElementById("pastStatements").innerHTML += '<br>' +  document.getElementById("mainStatement").innerHTML;
}
