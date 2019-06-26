function loadData() {
  request = new XMLHttpRequest();
  request.open('GET', 'python/corpus.json', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400){
      // Success!
      data = JSON.parse(request.responseText);
      console.log(data);
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


function Word() {



}
