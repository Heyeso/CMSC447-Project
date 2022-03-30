from flask import Flask
from flask.helpers import send_from_directory
from db_funcs import mysql, createTables, sampleData, fetchData

# create instance of app (secret key is needed for connecting to db)
app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

# MySQL database configurations (will need to change depending on pc)
app.config['MYSQL_DATABASE_USER'] = 'xxkat'
app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
app.config['MYSQL_DATABASE_DB'] = 'crime_data'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

app = Flask(__name__, static_folder='../client/build', static_url_path="")

# Serve React App
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, "index.html")

# Test API route - NOW TESTS THE DB
@app.route("/test")
def test():
    # DO NOT CALL THESE ONCE FULL DATABASE HAS BEEN CREATED AND LOADED - IT TAKES FOREVER
    # Create the tables (Drops them beforehand)
    createTables()
    # Loads in 10 data (GET RID OF < 10 STATEMENT TO CREATE WHOLE DATABASE)
    sampleData()
    # Fetches a list of dictionaries (Each dictionary is a crime)
    data = fetchData()
    # returns the first dictionary
    return data[0]


if __name__ == '__main__':
    app.run(debug=True)
