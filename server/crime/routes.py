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
    data = []
    cursor = crime_collection.aggregate(
        [{"$group": {"_id": {"Weapon": "$Weapon"}, "count": {"$sum": 1}}}]
    )

    for weapon in list(cursor):
        if weapon["_id"]["Weapon"] != "" and weapon["_id"]["Weapon"] != "NA":
            data.append(
                {
                    "type": weapon["_id"]["Weapon"].replace("_", " ").title(),
                    "value": weapon["count"],
                }
            )
    return {"tag": "bar", "title": "Weapons Distribution", "data": data}, 200

# Calculates the crime statistic for months distribution, from the database
@app.route("/api/crimes/statistics/weekdays", methods=["GET"])
def weekdays_distribution():
    data = []
    cursor = crime_collection.aggregate(
        [{'$project': {"weekdays": {"$dayOfWeek": "$CrimeDateTime"}}},
        {'$group': {"_id": {"weekdays": "$weekdays"}, "count": {'$sum': 1}}}]
    )
    print(list(cursor))
    for weekday in list(cursor):
        data.append(
            {
                "type": weekday["_id"]["weekdays"].title(),
                "value": weekday["count"],
            }
        )
    return {"tag": "bar", "title": "Weekdays Distribution", "data": data}, 200