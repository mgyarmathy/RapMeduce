import re
from stemming.porter import stem
from SyllableCounter import CountSyllables

_sim = 0.90
_f = 0.02
_syl = 0.08

def tokenize(string):
    tokenized = re.findall('\w+', string.lower())
    return [str(words) for words in tokenized]

def stopword(a_list_of_words):
    f = open('stop_word','r')
    stopwords = f.read().split()
    filteredtext = [t for t in a_list_of_words if t not in stopwords]
    return filteredtext

def stemming(a_list_of_words):
	stemmed = [stem(words) for words in a_list_of_words]
	return stemmed

def jaccard_similarity(line1_tokens, line2_tokens):
    a = set(line1_tokens)
    b = set(line2_tokens)
    return (float(len(a & b)) / float(len (a|b)))

def score(user_line, rhyme_line, rhyme_line_syllables, freq):
	user_line_tokens = stemming(stopword(tokenize(user_line)))
	rhyme_line_tokens = stemming(stopword(tokenize(rhyme_line)))

	# calculate user_line syllables
	user_line_syllables = 0
	for token in tokenize(user_line):
		user_line_syllables += CountSyllables(token)

	similarity = jaccard_similarity(user_line_tokens, rhyme_line_tokens)

	return (_sim*similarity) + (_f*(1.0/(float(freq)/34))) + (_syl*(1/float(abs(rhyme_line_syllables-user_line_syllables) + 0.01)))