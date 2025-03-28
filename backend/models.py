from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_security import UserMixin, RoleMixin



db = SQLAlchemy()


# User Model - Used for both Customer and Service Professional, differentiated by 'role'
class User(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now)
    #flask-security specifics
    fs_uniquifier = db.Column(db.String, unique=True, nullable=False)
    active = db.Column(db.Boolean, default = True) # if True user can log in, if false user can't log in
    roles = db.Relationship('Role', backref = 'bearers', secondary='user_roles')
    address =db.Column(db.Text)
    pincode= db.Column(db.Integer)

# Role Model - for Dfining Roles of the Users
class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable  = False)
    description = db.Column(db.String, nullable = False)


# User Role model - for giving user the roles (Association table created to create association between the user and the role)
class UserRoles(db.Model):
    __tablename__ = 'user_roles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))  
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))


# Service Category Model - Defines the categories for services
class ServiceCategory(db.Model):
    __tablename__ = 'service_categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.Text, nullable=True)
    
    services = db.relationship('Service', backref='category', lazy=True)  # One-to-Many relationship with Service


# Service Model - Defines types of services available on the platform
class Service(db.Model):
    __tablename__ = 'services'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    base_price = db.Column(db.Float, nullable=False)
    time_required = db.Column(db.Integer, nullable=False)  # Estimated time in minutes
    image_url = db.Column(db.Text, nullable=True)
    
    category_id = db.Column(db.Integer, db.ForeignKey('service_categories.id'), nullable=False)  # Link to ServiceCategory

# Professional Profile - Additional information specific to Service Professionals
class ProfessionalProfile(db.Model):
    __tablename__ = 'professional_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)  # Only one service expertise per professional
    experience_years = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    profile_status= db.Column(db.String, default= 'Pending')
    is_verified = db.Column(db.Boolean, default=False)  # Admin verification status
    pincode= db.Column(db.Integer)

    user = db.relationship('User', backref=db.backref('professional_profile', uselist=False))
    service = db.relationship('Service', backref='professionals')

   
# Document Model - Stores document details for service professionals
class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    document_type = db.Column(db.String(50), nullable=False)  # e.g., PAN Card, Aadhaar Card
    document_url = db.Column(db.String(200), nullable=False)  # URL or path to the uploaded document file
    is_verified = db.Column(db.Boolean, default=False)  # Document verification status by admin
    uploaded_at = db.Column(db.DateTime, default=datetime.now)
    remark = db.Column(db.Text) #remark to be sent by the admin which will be seen by the professional 

    user = db.relationship('User', backref='documents')

    
# Service Request - Represents a service booking made by a customer
class ServiceRequest(db.Model):
    __tablename__ = 'service_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Customer making the request
    professional_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Professional assigned to the request
    date_of_request = db.Column(db.DateTime, default=datetime.now)
    date_of_completion = db.Column(db.DateTime, nullable=True)
    service_status = db.Column(db.String(20), nullable=False, default="requested")  # requested, assigned, closed
    remarks = db.Column(db.Text, nullable=True)  # Customer's remarks post-service

    service = db.relationship('Service', backref='service_requests')
    customer = db.relationship('User', foreign_keys=[customer_id], backref='customer_requests')
    professional = db.relationship('User', foreign_keys=[professional_id], backref='professional_requests')

    

# Review Model - To store reviews/remarks given by customers on completed services
class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    service_request_id = db.Column(db.Integer, db.ForeignKey('service_requests.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # Rating out of 5
    comments = db.Column(db.Text, nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.now)

    service_request = db.relationship('ServiceRequest', backref='reviews')
    customer = db.relationship('User', foreign_keys=[customer_id], backref='customer_reviews')
    professional = db.relationship('User', foreign_keys=[professional_id], backref='professional_reviews')


   