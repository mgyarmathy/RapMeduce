#!flask/bin/python
import flask
from flask import Flask, Response, render_template
from flask.ext.pymongo import PyMongo
import os
import requests
from bson.json_util import dumps

app = Flask('rapMeduceTest', static_folder='../app', template_folder='../app')
mongo = PyMongo(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generateLines/<tail_word>', methods=['GET'])
def generateLines(tail_word):
    response = requests.get("http://rhymebrain.com/talk?function=getRhymes&word="+tail_word)
    rhymes = [line for line in response.json() if line['score'] == 300]
    result = []
    for word in rhymes:
        result.append(word['word'])
    return ', '.join(result)
    # cursor = mongo.db.testData.find()
    # return dumps(cursor)
    # return Response(rhyme_words, mimetype='application/json')

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