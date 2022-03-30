import csv
from tkinter import N
from flaskext.mysql import MySQL
import pymysql

# Create instance of MySQL
mysql = MySQL()

# This function will create the tables for the database. WARNING: DROPS TABLES IF THEY EXIST ALREADY.
# Params:   N/A
# Return:   N/A
def createTables():
    # Connect to db
    conn = mysql.connect()
    cursor = conn.cursor()

    # Drop the table if it exists
    query = 'DROP TABLE IF EXISTS crime'
    cursor.execute(query)

    # Create crime table
    query = "CREATE TABLE IF NOT EXISTS crime (\
                x FLOAT,\
                y FLOAT,\
                row_id INT PRIMARY KEY,\
                date_time DATETIME,\
                code VARCHAR(4),\
                location VARCHAR(128),\
                description VARCHAR(64),\
                inside_outside VARCHAR(64),\
                weapon VARCHAR(64),\
                post VARCHAR(16),\
                district VARCHAR(64),\
                neighborhood VARCHAR(64),\
                latitude FLOAT,\
                longitude FLOAT,\
                geolocation VARCHAR(64),\
                premise VARCHAR(64),\
                vri_name VARCHAR(64),\
                total_incidents INT,\
                shape VARCHAR(64))"
    cursor.execute(query)

    # Commit changes to db
    conn.commit()

    # Disconnect from db
    cursor.close()
    conn.close()

# This function will get the tuples from a specified table.
# Params:   N/A
# Return:   N/A
def fetchData():
    try:
        # Connect to db
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Create query
        query = "SELECT * FROM crime"

        # Execute and fetch data
        cursor.execute(query)
        rows = cursor.fetchall()

        # Return data as a list of dictionaries
        return rows
    finally:
        # Disconnect from db
        cursor.close()
        conn.close()

# This function will insert starting data into all tables.
# Params:   N/A
# Return:   N/A
def sampleData():
    # Connect to db
    conn = mysql.connect()
    cursor = conn.cursor()

    data = []
    # Read in crime data file
    with open('db_data.csv') as csvfile:
        data = csv.reader(csvfile)
        count = 0
        for row in data:
            # Handle NULL values and add quotes to VARCHAR rows
            for value in range(len(row)):
                if row[value] == '':
                    row[value] = 'NULL'
                elif value in [3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 18]:
                    # MySQL Does not handle the quotes well in varchars
                    row[value] = row[value].replace("'", '')
                    # Need to keep quotes around strings
                    row[value] = "'" + row[value] + "'"
            
            # Do not want to insert first row and only want 10 tuples to start
            if count != 0 and count <= 10:
                # Reformat datetime value
                row[3] = row[3].replace('+00', '')

                # Construct the query
                query = 'INSERT INTO crime VALUES(' + row[0] + ', ' + row[1] + ', ' + row[2] + ', ' + row[3] + ', ' + row[4] +\
                    ', ' + row[5] + ', ' + row[6] + ', ' + row[7] + ', ' + row[8] + ', ' + row[9] + ', ' + row[10] + ', ' +\
                    row[11] + ', ' + row[12] + ', ' + row[13] + ', ' + row[14] + ', ' + row[15] + ', ' + row[16] + ', ' +\
                    row[17] + ', ' + row[18] + ')'

                # Execute the query
                cursor.execute(query)
                #print(query)
            count += 1

    # Commit changes to db
    conn.commit()

    # Disconnect from db
    cursor.close()
    conn.close()