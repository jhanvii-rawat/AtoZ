from flask import current_app as app, jsonify, render_template,  request, send_file
from flask_security import auth_required, verify_password, hash_password
from backend.models import db
from datetime import datetime
#from backend.celery.tasks import add, create_csv
#from celery.result import AsyncResult

datastore = app.security.datastore
cache = app.cache

@app.route('/')
def home():
    return render_template('index.html')



@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not email or not password or not username:
        return jsonify({"message" : "Please enter all inputs"}), 404
    

