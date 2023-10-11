from flask import Flask, request, render_template, jsonify
import database


app = Flask(__name__)
database.create_tables()


@app.route("/get_messages.json")
def get_messages():
    messages = database.get_messages()
    return jsonify(messages)


app.run("0.0.0.0", 80)