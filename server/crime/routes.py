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
#@app.route("/api/crimes/statistics/weapons", methods=["GET"])
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
#@app.route("/api/crimes/statistics/weekdays", methods=["GET"])
def weekdays_distribution():
    data = []
    cursor = crime_collection.aggregate(
        [{'$project': {"weekdays": {"$dayOfWeek": "$CrimeDateTime"}}},
        {'$group': {"_id": {"weekday": "$weekdays"}, "count": {'$sum': 1}}}]
    )
    for weekday in list(cursor):
        data.append(
            {
                "type": str(weekday["_id"]["weekday"]).title(),
                "value": weekday["count"],
            }
        )
    return {"tag": "bar", "title": "Weekdays Distribution", "data": data}, 200

# Calculates the crime statistic for months distribution, from the database
@app.route("/api/crimes/statistics/<selection>", methods=["GET"])
def distribution(selection):
    # data will dictionaries for each data entry
    data = []
    # command will hold the query
    command = []
    # point will hold the _id call
    point = ""

    # Based on what distribution is put in the route
    if selection == 'weapons':
        command = [{"$group": {"_id": {"Weapon": "$Weapon"}, "count": {"$sum": 1}}}]
        point = 'Weapon'
    elif selection == 'weekdays':
        command = [{'$project': {"weekdays": {"$dayOfWeek": "$CrimeDateTime"}}},
                   {'$group': {"_id": {"Weekday": "$weekdays"}, "count": {'$sum': 1}}}]
        point = 'Weekday'

    # Aggregate the command
    cursor = crime_collection.aggregate(command)
    
    # Go through documents
    for document in list(cursor):
        item = str(document["_id"][point])
        if item != "" and item != "NA":
            data.append(
                {
                    "type": item.replace("_", " ").title(),
                    "value": document["count"],
                }
            )

    return {"tag": "bar", "title": point +  " Distribution", "data": data}, 200