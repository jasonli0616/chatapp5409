from flask import Flask, request, render_template
from . import database


app = Flask(__name__)



app.run("0.0.0.0", 80)