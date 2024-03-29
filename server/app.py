from flask import Flask
from flask_cors import CORS
from flask.helpers import send_from_directory
import pymongo
import os
import certifi

app = Flask(__name__, static_folder="../client/build", static_url_path="")
CORS(app)

# database
ca = certifi.where()
client = pymongo.MongoClient(os.environ.get("MONGODB_RO_URI"), tlsCAFile=ca)
db = client["cmscproj"]  # cmscproj database

# Serve React App
@app.route("/", methods=["GET"])
def serve():
    return send_from_directory(app.static_folder, "index.html")


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")


# routes
from crime.routes import *

if __name__ == "__main__":
    app.run(debug=True)
