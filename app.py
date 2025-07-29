import sqlite3
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import random

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
CORS(app, supports_credentials=True, origins=[
    "http://localhost:5000",
    "http://127.0.0.1:5000"
])

app.config.update(
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=False
)

class Database:

    def __init__(self, db_path):
        self.db = db_path

        #try to create database
        try:
            conn = sqlite3.connect(self.db)
            print("Database created succesfully")
        except:
            print("Unable to create Database")  #need error code?
        
        #make cursor
        cursor = conn.cursor()

        table = (
            """CREATE TABLE IF NOT EXISTS TICKETS (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entrant_name TEXT NOT NULL,
            entrant_age INTEGER NOT NULL,
            guest_name TEXT NOT NULL,
            random_token INTEGER NOT NULL    
            )"""
        )
        
        cursor.execute(table)
        print("Database table Tickets created")
        conn.commit()

        #close database connection
        if conn:
            conn.close()
            print("Database connection closed succesfully")

    def createRecord(self, data):

        #connect to db
        conn = sqlite3.connect(self.db)
        cursor = conn.cursor()

        #parse data
        if len(data) == 4:
            entrantName, entrantAge, guestName, randomToken = data
        else:
            print("invalid data cannot add to database")
            return jsonify({'Error': 'Ticket Not created'}), 400

        #add data to db
        cursor.execute("""INSERT INTO TICKETS (entrant_name, entrant_age, guest_name, random_token) VALUES (?, ?, ?, ?)""",
                    (entrantName, entrantAge, guestName, randomToken))
        
        #close db connection
        conn.commit()
        conn.close()

        return jsonify({'ok': 'Ticket Created Successfully'}), 201


    def retrieveAll(self):
        try:
            conn = sqlite3.connect(self.db)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT id, entrant_name, entrant_age, guest_name, random_token FROM TICKETS')
            rows = cursor.fetchall()
            conn.close()
            return jsonify([dict(row) for row in rows]), 200
        except:
            return jsonify({'error': 'Database error'}), 500


#create db
db = Database("Database")


#routes
def uploadTicket():
            #check for preexisting ticket
    if session.get('oompa') == 'loompa':
        return jsonify({'Error':'The Oompa Loompas already have recieved your ticket.'}), 403
    form = request.form
    try:
        entrantName = form['entrant_name']
        entrantAge = int(form['entrant_age'])
        guestName = form['guest_name']
    except KeyError:
        return jsonify({'error': 'Invalid age'}), 400
    
    randomToken = random.randint(0,6)
    data = [entrantName, entrantAge, guestName, randomToken]

    response, status =  db.createRecord(data)

    print(status)

        #save session data
    if (status == 201):
        session['oompa'] = 'loompa'

    return response ,status


def listTickets():
    data, status = db.retrieveAll()
    print(f"data: {data} status: {status}")
    return data, status


#manageRequest is used to return a 404 for any invalid request method
@app.route('/tickets', methods=['GET', 'POST'])
def manageRequest():
    if (request.method == 'GET'):
        return listTickets()
    elif (request.method == 'POST'):
        return uploadTicket()
    else:
        return jsonify({'error': '404 Not Found'}), 404




if __name__ == '__main__':
    app.run(debug=True)