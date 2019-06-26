let posCats = ['nn', 'vb', 'jj', 'prp', 'rb', 'ex'];
let groups = [[], [], [], [], [], []]

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
      console.log(groups);
    } else {
      // We reached our target server, but it returned an error
      console.log("error");
    }
  };

  request.send();
}

function changeAffect() {
  var affects = document.getElementById("affects");
  document.getElementById("mainStatement").innerHTML = affects.value;
  // console.log(affects.value);
}


function Word(text, affects) {
  this.text = text;
  this.affects = affects;

}
