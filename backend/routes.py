
from flask import current_app as app, jsonify, render_template,  request, send_file
from flask_security import auth_required, verify_password, hash_password
from backend.models import db, User, Role, ProfessionalProfile, Document
from datetime import datetime
#from backend.celery.tasks import add, create_csv
#from celery.result import AsyncResult

datastore = app.security.datastore


@app.route('/')
def index():
    return render_template('index.html')

@app.get('/protected')
@auth_required('token')
def protected():
    return '<h1> only accessible by auth user</h1>'

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message" : "invalid inputs"}), 404
    
    user = datastore.find_user(email = email)

    if not user:
        return jsonify({"message" : "invalid email"}), 404
    
    if verify_password(password, user.password):
        return jsonify({'token' : user.get_auth_token(), 'email' : user.email, 'role' : user.roles[0].name, 'id' : user.id})
    
    return jsonify({'message' : 'password wrong'}), 400

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not email or not password or role not in ['admin', 'user']:
        return jsonify({"message" : "invalid inputs"}), 404
    
    user = datastore.find_user(email = email)

    if user:
        return jsonify({"message" : "user already exists"}), 404

    try :
        datastore.create_user(email = email, password = hash_password(password), roles = [role], active = True)
        db.session.commit()
        return jsonify({"message" : "user created"}), 200
    except:
        db.session.rollback()
        return jsonify({"message" : "error creating user"}), 400
    
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    role = 'user'  # Default role for all new signups

    if not email or not password or not username:
        return jsonify({"message": "Invalid inputs"}), 404
    
    # Check if a user with the given email already exists
    user = datastore.find_user(email=email)

    if user:
        return jsonify({"message": "You have already registered"}), 404

    try:
        # Create a new user with the default role
        datastore.create_user(email=email, password=hash_password(password), username=username, roles=[role], active=True)
        db.session.commit()
        return jsonify({"message": "User created"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error creating user: {str(e)}"}), 400
