from json import loads
from bson.json_util import dumps
from flask import Flask, abort, jsonify, render_template, request, redirect
from app import app, db
import asyncio

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
crime_collection = db["crimes"]
crime_statistics_collection = db["crime_statistics"]

# GET requests
# Gets all the calculated crime statistics, from the database
@app.route("/api/crimes/statistics", methods=["GET"])
def crimes_statistics():
    cursor = crime_statistics_collection.find({}, {"_id": False})
    return jsonify(list(cursor)), 200

# Calculates the crime statistic for all distributions from the database, these routes do not use match and type (those are for filtering)
@app.route("/api/crimes/statistics/<selection>", defaults={'tag': CHARTS[0]}, methods=["GET"])
@app.route("/api/crimes/statistics/<selection>/<tag>", methods=["GET"])
def distribution(selection, tag, match=None, type=None):
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

    # Handle if there is a filter
    if (match != None) and (type != None):
        group = []
        # There are 4 options for data pairs: date/date, non-date/date, date/non-date, and non-date/non-date
        # Date/Date -           project date 1 and date 2, match date 2, group by date 1
        # Non-Date/Date -       project date (not in command) and include non-date, match date, group by non-date
        # Date/Non-Date -       project date (already in command) and include non-date, match non-date, group by date
        # Non-Date/Non-Date -   no projections, match non-date 2, group by non-date 1
        if match in PROJECTIONS.keys():
            type = int(type)
            # Ex. Date/Date - Selection is Weekdays, but match is Months, need the two projections, then the match, then the group
            if selection in PROJECTIONS.keys():
                # Add the second projection
                command[0]['$project'][match] = {"$" + PROJECTIONS[match]: "$CrimeDateTime"}
                group = [command[1]]
                command = [command[0]] + [{'$match': {match: type}}] + group
            # Ex. Non-Date/Date - Selection is Weapons, but match is Months, need two projections (1 for motnhs, then include weapons), then a match, then a group
            else:
                command = [{'$project': {match: {"$" + PROJECTIONS[match]: "$CrimeDateTime"}, GROUPS[selection]: 1}}] + [{'$match': {match: type}}] + command
        # Ex. Date/Non-Date - Selection is Months, but match is Weapons, need the months projection, then the match, then the group
        elif selection in PROJECTIONS.keys():
            command[0]['$project'][match] = 1
            command = [command[0]] + [{'$match': {match: type}}] + [command[1]]
        # Ex. Non-Date/Non-Date - Selection is Descriptions, but match is Weapons, need the match then the group
        else:
            command = [{'$match': {match: type}}] + command

    # Aggregate the command
    print(command)
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



# New Route for Expand Page filters
# To filter: weapons/FIRE or descriptions/ or districts/, weekdays/1-7 (Sunday-Saturday), hours/0-23 (12am-11pm), months/1-12 (January-December), years/2020
@app.route("/api/crimes/statistics/expand/<match>/<type>", methods=["GET"])
def expand_statistics(match, type):
    data = []

    # Need to filter for every selection except the one to match, and dates
    for selection in SELECTIONS:
        if selection != match and selection != "dates":
            # fix the match name to be able to group
            match_group = GROUPS[match]
            # find the filtered distribution and append the result
            result, code = distribution(selection, "bar", match_group, type)
            if code != 200:
                abort(404)
            data.append(result)
            
    return jsonify(data), 200
