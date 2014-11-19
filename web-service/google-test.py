import urllib
import json
import re

query = urllib.urlencode({'q': 'riding real slow'})
response = urllib.urlopen('http://ajax.googleapis.com/ajax/services/search/web?v=1.0&' + query ).read()
data = json.loads(response)
results = data['responseData']['results']
search_result_keywords = []
for result in results:
    search_result_keywords += re.findall('[a-z]+', result['content'].lower())
print set(search_result_keywords)