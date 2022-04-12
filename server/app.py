from flask import Flask
from flask_cors import CORS
from flask.helpers import send_from_directory
import pymongo
import os

app = Flask(__name__, static_folder="../client/build", static_url_path="")
CORS(app)

# database
client = pymongo.MongoClient(os.environ.get("MONGODB_RO_URI"))
db = client["cmscproj"]

# Serve React App
@app.route("/", methods=["GET"])
def serve():
    return send_from_directory(app.static_folder, "index.html")


# Test API route
@app.route("/api/test")
def test():
    return {"msg": "Test is working as expected", "status": 200}, 200


# routes
from crime.routes import *

if __name__ == "__main__":
    app.run(debug=True)
