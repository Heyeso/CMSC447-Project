from json import loads
from bson.json_util import dumps
from flask import Flask, jsonify, request, redirect
from app import app, db

WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

crime_collection = db["crime"]  # crime table
crime_statistics_collection = db["crime_statistics"]  # crime statistics table

# GET requests
# Gets all the calculated crime statistics, from the database
@app.route("/api/crimes/statistics", methods=["GET"])
def crimes_statistics():
    cursor = crime_statistics_collection.find({}, {"_id": False})
    return jsonify(list(cursor)), 200

# Calculates the crime statistic for all distributions from the database
@app.route("/api/crimes/statistics/<selection>", methods=["GET"])
def distribution(selection):
    # data will hold dictionaries for each data entry
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
    all_docs = sorted(list(cursor), key = lambda i:i['_id'][point])
    item = ""
    for document in all_docs:
        # Need to convert nums to weekdays if this is the selection
        if selection == 'weekdays':
            item = WEEKDAYS[document["_id"][point] - 1]
        else:
            item = str(document["_id"][point])
    
        # Check for valid data
        if (item != "") and (item != "NA"):
            data.append(
                {
                    "type": item.replace("_", " ").title(),
                    "value": document["count"],
                }
            )

    return {"tag": "bar", "title": point +  " Distribution", "data": data}, 200