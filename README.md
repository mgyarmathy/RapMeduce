#RapMeduce

##Setup

Requires: Python 2.x and MongoDB

`pip install -r requirements.txt`

`mongoimport --db rapMeduce --collection lyrics --file lyrics-export.json`

`cd web-service`

`python server.py`

and point your browser to localhost:5000