#RapMeduce

##Setup

Requires: Python 2.x and MongoDB

`pip install Flask-PyMongo simplejson stemming random os requests`
`mongoimport --db rapMeduce --collection lyrics --file lyrics-export.json`
`cd web-service`
`python server.py`