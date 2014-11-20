#RapMeduce

##Setup

Requires: Python 2.x and MongoDB

Install pip dependencies:

`pip install -r requirements.txt`

Download MongoDB export file (this might take a while):

`curl https://s3-us-west-2.amazonaws.com/rap-meduce/lyrics-export.json -o lyrics-export.json`

Import the MongoDB database:

`mongoimport --db rapMeduce --collection lyrics --file lyrics-export.json`

Run the server:

`cd web-service`

`python server.py`

and point your browser to localhost:5000