from bson.json_util import dumps
from flask import Flask, jsonify, request, redirect
from app import app, db

collection = db["crime"]

# GET requests
@app.route("/api/crimes", methods=["GET"])
def crimes():
    weapons = collection.distinct("Weapon")
    data = []
    for type in weapons:
        number_of_crimes = collection.count_documents({"Weapon": type})
        data.append({"type": type, "value": number_of_crimes})

    return {"tag": "bar", "title": "Weapons Distribution", "data": data}, 200
