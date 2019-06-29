import csv, string
from nltk import word_tokenize, pos_tag

scripts = ['script-1', 'script-2']
words = []
sentences = []
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
print(emotions)

for s in scripts:
	with open(s + '.txt', 'r') as f:
		for line in f:
			line = line.strip()
			sentences.append(line)

            for p in punct:
                line = line.replace(p, '')
            # line = line.translate(None, string.punctuation)
            line = line.lower()
            #strip out punctuation
            l = line.split(" ")
            for word in l:
                if word not in words:
                    words.append(word)
                # else:
                #     print "Already exists!"

# print(sentences)
# print words

with open('corpus-s.json', 'w') as f:
	f.write('[\n')
    # for w in words:
	for s in sentences:
		affects = []
		# pos = []
		# tokens = word_tokenize(w)
		tokens = word_tokenize(s)

		# pos_long = pos_tag(tokens)

		# for p in pos_long:
		# 	pos.append(p[1])
			# print pos

		for t in tokens:
			# print(t)
			for e in emotions:
				if t == e[0]:
					# print t
					for i in range(1, len(e)):
						if e[i] not in affects:
							affects.append(e[i])
							print affects

		f.write('\n\t{\n\t\"sentence\": \"' + s + '\",\n\t\t\"affects\": ' + str(affects) + '\n\t},')
	f.write('\n]')

print("All done")
