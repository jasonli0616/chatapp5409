from flask import Flask, request, render_template, jsonify
import database


app = Flask(__name__)
database.create_tables()


@app.route("/api/create_user", methods=["POST"])
def api_create_user():
    ip = request.remote_addr
    username = request.form["username"]

    database.create_user()

    return jsonify(success=True)


@app.route("/api/get_messages.json")
def api_get_messages():
    messages = database.get_messages()
    return jsonify(messages)


app.run("0.0.0.0", 80)