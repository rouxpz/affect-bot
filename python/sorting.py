import csv, string
from nltk import word_tokenize, pos_tag

scripts = ['script-1', 'script-2', 'poem-2', 'poem-3']
words = []
emotions = []
punct = ".?!,\"-"

#add emotions to dictionary here
with open('NRC-emotion-lexicon-wordlevel-alphabetized-v0.92.txt', 'rb') as f:
	reader = csv.reader(f, delimiter="\t")
	for row in reader:
		if row[2] == "1":
			if len(emotions) == 0:
				emotions.append([row[0], row[1]])
			else:
				for i in range(len(emotions)-1, len(emotions)):
					if row[0] in emotions[i]:
						emotions[i].append(row[1])
						continue
					else:
						emotions.append([row[0], row[1]])

print("Emotions loaded!")

for s in scripts:
    with open(s + ".txt", 'r') as f:
        for line in f:
            for p in punct:
                line = line.replace(p, '')
            # line = line.translate(None, string.punctuation)
            line = line.strip().lower()
            #strip out punctuation
            l = line.split(" ")
            for word in l:
                if word not in words:
                    words.append(word)
                # else:
                #     print "Already exists!"

# print words
with open('corpus.json', 'w') as f:
	f.write('[\n')

	for w in words:
		affects = []
		pos = []

		tokens = word_tokenize(w)
		pos_long = pos_tag(tokens)

		for p in pos_long:
			pos.append(p[1])
			# print pos

		for e in emotions:
			if w == e[0]:
				# print w
				for i in range(1, len(e)):
					affects.append(e[i])

		f.write('\n\t{\n\t\"word\": \"' + w + '\",\n\t\t\"affects\": ' + str(affects) + ',\n\t\t\"pos\": ' + str(pos) + '\n\t},')
	f.write('\n]')

print("All done")
