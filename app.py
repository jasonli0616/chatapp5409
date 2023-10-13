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
    """Show homepage."""

    ip = request.remote_addr
    username = database.get_username(ip)

    return render_template("index.html", username=username)


@app.route("/change_username", methods=["POST"])
def change_username():
    """
    Form sends POST request here to create/change username.

    This will attempt to create/edit user, and redirect to homepage with success/failure alert.
    """
    
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
    """
    Handles user sending message from frontend.

    Adds message to database, and broadcasts JSON of messages.
    """

    text = data["text"]
    if text:
        ip = request.remote_addr
        database.send_message(ip, text)
        socketio.emit("new_message", json.dumps(database.get_messages()))


@socketio.event
def get_messages():
    """Handles request for messages, and emits back JSON of messages."""

    emit("new_message", json.dumps(database.get_messages()))


socketio.run(app, "0.0.0.0", port=80)