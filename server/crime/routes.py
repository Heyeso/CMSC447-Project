from json import loads
from bson.json_util import dumps
from flask import Flask, jsonify, request, redirect
from app import app, db

crime_collection = db["crime"]  # crime table
crime_statistics_collection = db["crime_statistics"]  # crime statistics table

# GET requests
# Gets all the calculated crime statistics, from the database
@app.route("/api/crimes/statistics", methods=["GET"])
def crimes_statistics():
    cursor = crime_statistics_collection.find({}, {"_id": False})
    return jsonify(list(cursor)), 200


# Calculates the crime statistic for weapons distribution, from the database
@app.route("/api/crimes/statistics/weapons", methods=["GET"])
def weapons_distribution():
    weapons = crime_collection.distinct("Weapon")
    data = []
    for type in weapons:
        number_of_crimes = crime_collection.count_documents({"Weapon": type})
        data.append({"type": type, "value": number_of_crimes})

    return {"tag": "bar", "title": "Weapons Distribution", "data": data}, 200
