import re
import json
import urllib
from stemming.porter import stem
from SyllableCounter import CountSyllables

#_sim = 0.60
#_f = 0.10
#_syl = 0.30

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

def query_expansion(tokens):
    query = urllib.urlencode({'q': ' '.join(tokens)})
    response = urllib.urlopen('http://ajax.googleapis.com/ajax/services/search/web?v=1.0&' + query ).read()
    data = json.loads(response)
    results = data['responseData']['results']
    line_1_search_result_keywords = []
    for result in results:
        line_1_search_result_keywords += re.findall('[a-z]+', result['content'].lower())
    return line_1_search_result_keywords

def score(user_line, rhyme_line, rhyme_line_syllables, freq, _sim, _f, _syl):

    user_line_tokens = stemming(stopword(tokenize(user_line)))
    rhyme_line_tokens = stemming(stopword(tokenize(rhyme_line)))

    # calculate user_line syllables
    user_line_syllables = 0
    for token in tokenize(user_line):
        user_line_syllables += CountSyllables(token)

    # to be replaced with another similarity metric
    similarity = jaccard_similarity(user_line_tokens, rhyme_line_tokens)
    # similarity = jaccard_similarity(query_expansion(user_line_tokens), query_expansion(rhyme_line_tokens))
    # print str((_sim*similarity)) + ' ' + str((_f*(1.0/(float(freq)/34.0)))) + ' ' + str((_syl*(1.0/float(abs(rhyme_line_syllables-user_line_syllables) + 1.0))))


    return (_sim*similarity) + (_f*(1.0/(float(freq)/34.0))) + (_syl*(1.0/float(abs(rhyme_line_syllables-user_line_syllables) + 1.0)))