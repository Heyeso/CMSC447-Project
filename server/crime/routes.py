from flask import abort, jsonify, request
from app import app, db
import asyncio

# Constants
WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
CHARTS = ['bar', 'pie', 'line']
# Valid selections
SELECTIONS = ['weapons', 'weekdays', 'hours', 'dates', 'descriptions', 'districts', 'months', 'years']
# Titles and parts of relevant commands
TITLES = {'weapons': 'Weapon', 'weekdays': 'Weekday', 'hours': 'Hour', 'dates': 'Date', 'descriptions': 'Description', 'districts': 'District', 'months': 'Month', 'years': 'Year'}
GROUPS = {'weapons': 'Weapon', 'weekdays': 'weekdays', 'hours': 'hours', 'dates': 'dates', 'descriptions': 'Description', 'districts': 'District', 'months': 'months', 'years': 'years'}
PROJECTIONS = {'weekdays': 'dayOfWeek', 'hours': 'hour', 'dates': 'dateToString', 'months': 'month', 'years': 'year'}

# crime and crime stats tables
crimes_collection = db["crimes"]
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
def distribution(selection, tag, match_type=None):
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

    # Bad matches - should throw a 404
    if match_type:
        # If there are not pairs, then abort
        if len(match_type) % 2 == 1:
            abort(404)
        for value in range(len(match_type)):
            # If the match is not a valid selection, abort
            if value % 2 == 0:
                if match_type[value] not in SELECTIONS:
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

    # Add all projections to every command (this is to support multiple matching for filtering)
    for all_selections in SELECTIONS:
        # Do not want to use dates
        if all_selections != 'dates':
            # Need to know if command[0] already has a projection
            if selection in PROJECTIONS.keys() or ('$project' in command[0]):
                # If it does, need to add the aggregations for dates and include non-dates
                if all_selections in PROJECTIONS.keys():
                    command[0]['$project'][GROUPS[all_selections]] = {"$" + PROJECTIONS[all_selections]: "$CrimeDateTime"}
                else:
                    command[0]['$project'][GROUPS[all_selections]] = 1
            else:
                # If no projection field, need to add projection aggregation for dates and include non-dates
                if all_selections in PROJECTIONS.keys():
                    command = [{'$project': {GROUPS[all_selections]: {"$" + PROJECTIONS[all_selections]: "$CrimeDateTime"}}}] + command
                else:
                    command = [{'$project': {GROUPS[all_selections]: 1}}] + command
    
    # Handle if there is a filter (Need type to be an int if date value)
    for pair in range(0, len(match_type), 2):
        if match_type[pair] in PROJECTIONS.keys():
            match_type[pair + 1] = int(match_type[pair + 1])
        # First match just needs a match
        if pair == 0:
            command = [command[0]] + [{'$match': {GROUPS[match_type[pair]]: match_type[pair + 1]}}] + [command[1]]
        # Second match must have a match with an and
        elif pair == 2:
            command[1] = {'$match': {'$and': [{GROUPS[match_type[0]]: match_type[1]}, {GROUPS[match_type[pair]]: match_type[pair + 1]}]}}
        # Third or more matces must apend to the and
        else:
            command[1]['$match']['$and'].append({GROUPS[match_type[pair]]: match_type[pair + 1]})

    # Aggregate the command
    cursor = crimes_collection.aggregate(command)
    
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
# This can work for multiple filters.
@app.route("/api/crimes/statistics/expand/<path:match_type_pairs>", methods=["GET"])
def expand_statistics(match_type_pairs):
    data = []
    match_type_pairs = match_type_pairs.split("/")

    # Need to convert weekdays/months to corresponding numbers, and all types should be converted to uppercase, with %20 replaced with spaces
    for types in range(1, len(match_type_pairs), 2):
        match_type_pairs[types] = match_type_pairs[types].upper()
        if match_type_pairs[types - 1] in PROJECTIONS.keys():
            # Weekdays
            if match_type_pairs[types - 1] == 'weekdays':
                if match_type_pairs[types] in WEEKDAYS:
                    match_type_pairs[types] = WEEKDAYS.index(match_type_pairs[types]) + 1
                # Invalid weekday
                else:
                    abort(404)
            # Months
            elif match_type_pairs[types - 1] == 'months':
                if match_type_pairs[types] in MONTHS:
                    match_type_pairs[types] = MONTHS.index(match_type_pairs[types]) + 1
                # Invalid month
                else:
                    abort(404)
            # Replace %20 with space
            else:
                match_type_pairs[types] = match_type_pairs[types].replace('%20', ' ')

    # Need to filter for every selection except the ones to match, and dates
    for selection in SELECTIONS:
        if selection != "dates":
            # find the filtered distribution and append the result
            result, code = distribution(selection, "bar", match_type_pairs)
            if code != 200:
                abort(404)
            data.append(result)
            
    return jsonify(data), 200

# GET requests
# Returns a list of all the crimes according to filter.
@app.route("/api/crimes/map/filters", methods=["GET"])
def map():

    size =  request.args.get("n")
    if size == None or not size.isnumeric():
        size = 1000
    else:
        size = int(size)
        if size > 1000:
            size = 1000

    weapon = request.args.get('Weapons')
    description = request.args.get('Description')
    district = request.args.get('District')
    weekday = request.args.get('Weekday')
    hour = request.args.get('Hour')
    month = request.args.get('Month')
    year = request.args.get('Year')
    #TODO: dates = request.args.get('Date')

    req = [
        {
            "$project": {
                "CrimeCode": "$CrimeCode",
                "Description": "$Description",
                "District": "$District",
                "GeoLocation": {
                    "Latitude": "$Latitude",
                    "Longitude": "$Longitude",
                },
                "Inside_Outside": "$Inside_Outside",
                "Location": "$Location",
                "Neighborhood": "$Neighborhood",
                "Post": "$Post",
                "Premise": "$Premise",
                "RowID": "$RowID",
                "Shape": "$Shape",
                "Total_Incidents": "$Total_Incidents",
                "VRIName": "$VRIName",
                "Weapon": "$Weapon",
                "_id": 0,
                "Date": "$CrimeDateTime",
                "CrimeDate": {
                    "year": { "$year": "$CrimeDateTime" },
                    "month": { "$month": "$CrimeDateTime" },
                    "hour": { "$hour": "$CrimeDateTime" },
                    "dayOfWeek": { "$dayOfWeek": "$CrimeDateTime" }
                },

            }
        },
        {"$limit": size},
    ]
    match = {}
    # {$where : 'return this.date.getMonth() == 11'}
    if weapon != None:
        match["Weapon"] = weapon.upper().replace(" ", "_")
    if description != None:
        match["Description"] = description.upper()
    if district != None:
        match["District"] = district.upper()
    if weekday != None:
        match["CrimeDate.dayOfWeek"] =  WEEKDAYS.index(weekday) + 1
    if hour != None:
        match["CrimeDate.hour"] =  int(hour.split(":")[0])
    if month != None:
        match["CrimeDate.month"] =  MONTHS.index(month) + 1
    if year != None:
        match["CrimeDate.year"] =  int(year)

    req.insert(1, {"$match": match})
    print(req)
    cursor = crimes_collection.aggregate(req)

    return jsonify(list(cursor)), 200
