from flask import abort, jsonify, request
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
crimes_collection = db["crimes"]
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
    cursor = crimes_collection.aggregate(req)

    return jsonify(list(cursor)), 200