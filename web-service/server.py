#!flask/bin/python
import flask
from flask import Flask
from flask import Response
from flask import render_template
from flask.ext.pymongo import PyMongo
import json
from bson.json_util import dumps
import os
import urllib2

app = Flask('rapMeduceTest', static_folder='../app', template_folder='../app')
mongo = PyMongo(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generateLines/<tail_word>', methods=['GET'])
def generateLines(tail_word):
    rhyme_words = urllib2.urlopen("http://rhymebrain.com/talk?function=getRhymes&word="+tail_word).read()
    # cursor = mongo.db.testData.find()
    # return dumps(cursor)
    return Response(rhyme_words, mimetype='application/json')

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