from flask import current_app as app
from backend.models import db
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():
    db.create_all()

    userdatastore : SQLAlchemyUserDatastore = app.security.datastore

    userdatastore.find_or_create_role(name = 'admin', description = 'superuser')
    userdatastore.find_or_create_role(name = 'user', description = 'general user')
    userdatastore.find_or_create_role(name = 'professional', description = 'service professional')

    if (not userdatastore.find_user(email = 'admin@study.iitm.ac.in')):
        userdatastore.create_user(email = 'admin@study.iitm.ac.in', password = hash_password('pass'), roles = ['admin'] , username = 'admin1')
    
    if (not userdatastore.find_user(email = 'user01@study.iitm.ac.in')):
        userdatastore.create_user(email = 'user01@study.iitm.ac.in', password = hash_password('pass'), roles = ['user'], username = 'useradmin1' ) # for testing

    if (not userdatastore.find_user(email = 'proff01@study.iitm.ac.in')):
        userdatastore.create_user(email = 'proff01@study.iitm.ac.in', password = hash_password('pass'), roles = ['professional'], username = 'professional1' ) # for testing

    db.session.commit()