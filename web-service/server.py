#!flask/bin/python
import flask
from flask import Flask, Response, render_template
from flask.ext.pymongo import PyMongo
import os
import requests
import re
import random
import RhymeScore
from bson.json_util import dumps

app = Flask('rapMeduce', static_folder='../app', template_folder='../app')
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
    # for word in rhymes:
    # TODO: remove this bottleneck
    for word in random.sample(rhymes, 15):
        # get all lines in db that match tail word
        # TODO: remove or increase query limit
        cursor = mongo.db.lyrics.find({'tail_word': word['word']}).limit(10)
        # iterate through cursor and append each rhyme to rhyming_lines
        for rhyme in cursor:
            rhyme['score'] = RhymeScore.score(line, rhyme['line'], rhyme['syllables'], word['freq'])
            rhyming_lines.append(rhyme)
    top_rhymes = sorted(rhyming_lines, key=lambda k: k['score'], reverse=True)[:10] 
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