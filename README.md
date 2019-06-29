# Affect Bot

Bot project for Beyond Verification research group.  

### TO ADD NEW WORDS TO CORPUS:  

Run **sorting.py** in the terminal, which will generate a JSON file with every script or poem included in the "python" folder. *This JSON will need to be run through a validator and adjusted manually to work properly.* I recommend using [this one](https://jsonformatter.org/).

There is also a file called **sorting-sentences.py**, which will add new sentences to the **corpus-s.json** document in case you want to use the Markov Chain option in the JavaScript file.

The JSON files will contain the text from the script in pieces (words or sentences, depending on which one you use); the associated affects; and, for **corpus.json**, the part of speech of the word.

### THE WEB INTERFACE  

There are two options for generating phrases: one using parts of speech, and one using Markov chains (via the [RiTA library](https://rednoise.org/rita/reference/index.php)). The Markov chain option is commented out at the moment. The eventual intent is to combine the two in some way.

New sentence constructions can be added in the **js/bot.js** file by adding to the **constructions** array. This should take the form of an array containing the parts of speech you want your sentence to follow, in order. I am using the UPenn tag set, default with NLTK, which is detailed [here](https://medium.com/@gianpaul.r/tokenization-and-parts-of-speech-pos-tagging-in-pythons-nltk-library-2d30f70af13b) pretty nicely.

The bot is set to auto refresh the generated phrases every 5 seconds. This can be changed in the **switchAffect()** function in **js/bot.js**, as a parameter within **setInterval()**. If the page is refreshed, the entire history will be cleared; there is no database (everything is done client side at the moment).
