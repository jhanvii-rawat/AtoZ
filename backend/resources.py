from flask_restful import Api, Resource, fields, marshal, marshal_with
from backend.models import Role, Service, User, db
from flask_security import auth_required
from flask import jsonify, request




api = Api(prefix='/api')


