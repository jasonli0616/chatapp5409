from flask import Flask, request, render_template, flash
from flask_socketio import SocketIO, emit
import dotenv
import os
import json
import database

dotenv.load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

database.create_tables()


@app.route("/", methods=["GET", "POST"])
def index():
    ip = request.remote_addr
    username = None

    if request.method == "GET":
        username = database.get_username(ip)

    else:
        username = request.form["username"]
        if username:
            database.create_user(ip, username)
        else:
            flash("Username is required.")


    return render_template("index.html", username=username)


@socketio.event
def send_message(data):
    text = data["text"]
    if text:
        ip = request.remote_addr
        database.send_message(ip, text)
        socketio.emit("new_message", json.dumps(database.get_messages()))


@socketio.event
def get_messages():
    emit("new_message", json.dumps(database.get_messages()))


socketio.run(app, "0.0.0.0", port=80)