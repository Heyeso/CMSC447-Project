from json import loads
from bson.json_util import dumps
from flask import Flask, abort, jsonify, render_template, request, redirect
from app import app, db

# Constants
WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
CHARTS = ['bar', 'pie', 'line']
# Valid selections
SELECTIONS = ['weapons', 'weekdays', 'hours', 'dates', 'descriptions', 'districts', 'months', 'years']
# Titles and parts of relevant commands
TITLES = {'weapons': 'Weapon', 'weekdays': 'Weekday', 'hours': 'Hour', 'dates': 'Date', 'descriptions': 'Description', 'districts': 'District', 'months': 'Month', 'years': 'Year'}
GROUPS = {'weapons': 'Weapon', 'weekdays': 'weekdays', 'hours': 'hours', 'dates': 'dates', 'descriptions': 'Description', 'districts': 'District', 'months': 'months', 'years': 'years'}
PROJECTIONS = {'weekdays': 'dayOfWeek', 'hours': 'hour', 'dates': 'dateToString', 'months': 'month', 'years': 'year'}

# crime and crime stats tables
crime_collection = db["crime"]
crime_statistics_collection = db["crime_statistics"]

# GET requests
# Gets all the calculated crime statistics, from the database
@app.route("/api/crimes/statistics", methods=["GET"])
def crimes_statistics():
    cursor = crime_statistics_collection.find({}, {"_id": False})
    return jsonify(list(cursor)), 200

# Calculates the crime statistic for all distributions from the database
@app.route("/api/crimes/statistics/<selection>", defaults={'tag': CHARTS[0]}, methods=["GET"])
@app.route("/api/crimes/statistics/<selection>/<tag>", methods=["GET"])
def distribution(selection, tag):
    # data will hold dictionaries for each data entry
    data = []
    # command will hold the query
    command = []
    # point will hold the _id call
    point = ""

    # Bad tags - should throw a 404
    if tag not in CHARTS:
        abort(404)
    # Bad selections - should throw a 404
    if selection not in SELECTIONS:
        abort(404)

    # Create commands and title point
    if selection in PROJECTIONS.keys() and selection != 'dates':
        command = [{'$project': {selection: {"$" + PROJECTIONS[selection]: "$CrimeDateTime"}}},
                   {'$group': {"_id": {TITLES[selection]: "$" + GROUPS[selection]}, "count": {'$sum': 1}}}]
    elif selection == 'dates':
        command = [{'$project': {"dates": {"$dateToString": {"format": "%Y-%m-%d", "date": "$CrimeDateTime"}}}},
                   {"$group": {"_id": {"Date": "$dates"}, "count": {"$sum": 1}}}]
    else:
        command = [{"$group": {"_id": {TITLES[selection]: "$" + GROUPS[selection]}, "count": {"$sum": 1}}}]
    point = TITLES[selection]


    # Aggregate the command
    cursor = crime_collection.aggregate(command)
    
    # Go through documents
    all_docs = sorted(list(cursor), key = lambda i:i['_id'][point])
    item = ""
    for document in all_docs:
        # Need to convert nums to weekdays, hours need ":00", nums to months if these are the selection
        if selection == 'weekdays':
            item = WEEKDAYS[document["_id"][point] - 1]
        elif selection == 'hours':
            item = str(document["_id"][point]) + ':00'
        elif selection == 'months':
            item = MONTHS[document["_id"][point] - 1]
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

    return {"tag": tag, "title": point +  " Distribution", "data": data}, 200