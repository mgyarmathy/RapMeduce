#!flask/bin/python
import flask
from flask import Flask, Response, render_template
from flask.ext.pymongo import PyMongo
import os
import requests
import re
from ast import literal_eval
import json
import random
import RhymeScore
from bson.json_util import dumps

# app = Flask('rapMeduce', static_folder='../app', template_folder='../app')
app = Flask('rapMeduceInvertedIndex', static_folder='../app', template_folder='../app')
mongo = PyMongo(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generateLines/<line>', methods=['GET'])
def generateLines(line):
    # get a list of all of the words in the user's line
    words = [i for i in re.findall("\w+'*\w*", line.lower())]
    tail_word = words[-1]
    # query rhymebrain to get matching words
    response = requests.get("http://rhymebrain.com/talk?function=getRhymes&word="+tail_word)
    # filter out imperfect matches
    rhymes = [word for word in response.json() if word['score'] == 300]
    rhyming_lines = []
    count = 0
    for word in rhymes:
        # get all lines in db that match tail word
        lyrics = mongo.db.lyrics.find_one({'tail_word': word['word']})
        if (lyrics is not None):
            for lyric in lyrics['lines'].split('##'):
                try:
                    rhyme = literal_eval(lyric)
                    rhyme['artist'] = rhyme['artist'].replace('\\u2019', "'")
                    rhyme['song'] = rhyme['song'].replace('\\u2019', "'")
                    rhyme['line'] = rhyme['line'].replace('\\u2019', "'")
                    rhyme['score'] = RhymeScore.score(line, rhyme['line'], rhyme['syllables'], word['freq'])
                    rhyming_lines.append(rhyme)
                except (SyntaxError):
                    pass
    top_rhymes = sorted(rhyming_lines, key=lambda k: k['score'], reverse=True)[:10] 
    print top_rhymes
    return Response(dumps(top_rhymes), mimetype='application/json')

@app.route('/js/<path:path>')
def static_js(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(os.path.join('js', path))

@app.route('/css/<path:path>')
def static_css(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(os.path.join('css', path))

if __name__ == '__main__':
    app.run(debug=True)