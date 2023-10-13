from flask import Flask, request, render_template, flash, redirect, url_for
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


@app.route("/")
def index():
    ip = request.remote_addr
    username = database.get_username(ip)

    return render_template("index.html", username=username)


@app.route("/change_username", methods=["POST"])
def change_username():
    ip = request.remote_addr
    username = request.form["username"]
    if username:
        try:
            database.create_user(ip, username)
            flash("Username successfully created/changed.", "success")
        except NameError:
            flash("Username already exists.", "danger")
            username = None
    else:
        flash("Username is required.", "danger")
    
    return redirect(url_for("index"))


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