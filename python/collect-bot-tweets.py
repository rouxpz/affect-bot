import csv, os, re

textToWrite = ''

with open('files/ira_tweets_csv_hashed.csv', 'r') as f:
    # print 'file opened'
    botReader = csv.reader(f)
    for row in botReader:
        # print row[12]
        m = re.match(r'^[A-Za-z]+', row[12])
        if m != None and 'RT' not in row[12]:
            link = re.findall(r'(?:www|https?)[^\s]+', row[12])
            if len(link) > 0:
                # print link
                for l in link:
                    row[12] = row[12].replace(l, '')

            mention = re.findall(r'@[^\s]+', row[12])
            # hashtag = re.findall(r'#[^\s]+', row[12])

            if len(mention) > 0:
                for me in mention:
                    row[12] = row[12].replace(me, '')

            # if len(hashtag) > 0:
            #     for h in hashtag:
            row[12] = row[12].replace('#', '')

            if len(row[12]) > 0:    # print row[12]
                row[12] = ' '.join(row[12].split())
                textToWrite += row[12] + ". "

print 'text added'

with open('files/bot-text.txt', 'w+') as g:
    g.write(textToWrite)
    g.close()
