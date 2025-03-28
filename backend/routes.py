
import os
from flask import current_app as app, jsonify, render_template,  request, send_file, send_from_directory
from flask_login import login_required
from flask_security import auth_required, verify_password, hash_password, current_user
from backend.models import Review, Service, ServiceCategory, ServiceRequest, db, User, Role, ProfessionalProfile, Document
from datetime import datetime
from sqlalchemy import func
from werkzeug.utils import secure_filename
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

# Folder to store uploaded files
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Serve files from the 'uploads' folder
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400
    
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({"message": "File uploaded", "file_url": f"/uploads/{filename}"})

    
@app.route('/register', methods=['POST'])
def register():
    if 'multipart/form-data' in request.content_type:
        data = request.form
        files = request.files

        email = data.get('email')
        password = data.get('password')
        username = data.get('username')
        role = 'professional'  # Default for new professionals
        pincode = data.get('pincode')
        service_id = data.get('service')
        experience_years = data.get('experience_years')
        document_type = data.get('document_type')
        document_file = files.get('document_file')

        if not all([email, password, username, pincode, service_id, experience_years, document_type, document_file]):
            return jsonify({"message": "Invalid inputs"}), 404

        # Check if user already exists
        user = datastore.find_user(email=email)
        if user:
            return jsonify({"message": "User already exists"}), 404

        try:
            # Create a new user
            new_user = datastore.create_user(
                email=email,
                password=hash_password(password),
                username=username,
                roles=[role],
                active=True
            )
            db.session.add(new_user)
            db.session.flush()  # Get the new user ID

            # Save document to server and record details
            doc_filename = secure_filename(document_file.filename)
            document_path = os.path.join('uploads', doc_filename)  # Define your upload folder
            document_file.save(document_path)

            document = Document(
                user_id=new_user.id,
                document_type=document_type,
                document_url=document_path,
                is_verified=False  # Default status for new uploads
            )
            db.session.add(document)

            # Create professional profile
            professional_profile = ProfessionalProfile(
                user_id=new_user.id,
                service_id=service_id,
                experience_years=experience_years,
                pincode=pincode
            )
            db.session.add(professional_profile)

            db.session.commit()
            return jsonify({"message": "User registered successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Error during registration: {str(e)}"}), 400
    else:
        return jsonify({"message": "Invalid Content-Type"}), 400








##################################### ADMIN ROUTES ##########################################################


@app.route('/admindashboard', methods=['GET'])
@auth_required('token')
def admindashboard():
    try:
        total_users = db.session.query(func.count(User.id)).filter(User.roles.any(name='user')).scalar()
        # Total users with the 'user' role
        total_users = db.session.query(func.count(User.id)).filter(User.roles.any(name='user')).scalar()
        
        # Total number of professionals with a professional profile
        total_professionals = db.session.query(func.count(ProfessionalProfile.id)).filter(
            ProfessionalProfile.profile_status.in_(['Verified'])).scalar()

        # Professionals by status
        verified_professionals = db.session.query(func.count(ProfessionalProfile.id)).filter(
            ProfessionalProfile.profile_status == 'Verified').scalar()
        pending_professionals = db.session.query(func.count(ProfessionalProfile.id)).filter(
            ProfessionalProfile.profile_status == 'Pending').scalar()
        rejected_professionals = db.session.query(func.count(ProfessionalProfile.id)).filter(
            ProfessionalProfile.profile_status == 'Rejected').scalar()

        return jsonify({
                'total_users': total_users,
                'total_professionals': total_professionals,
                'verified_professionals': verified_professionals,
                'pending_professionals': pending_professionals,
                'rejected_professionals': rejected_professionals,
            })
    except Exception as e:
        print(f"Error in admin_overview: {e}")
        return jsonify({'error': 'An error occurred'}), 500





@app.route('/categories', methods=['GET'])
def get_categories():
    categories = ServiceCategory.query.all()
    return jsonify([{
        'id': category.id,
        'name': category.name,
        'description': category.description,
        'image_url': category.image_url
    } for category in categories])

@app.route('/categories', methods=['POST'])
def add_category():
    data = request.json
    if not data or not data.get('name') or not data.get('image_url'):
        return jsonify({'error': 'Name and Image URL are required'}), 400
    
    # Check if category with the same name already exists
    if ServiceCategory.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Category already exists'}), 409
    
    new_category = ServiceCategory(
        name=data['name'],
        description=data.get('description'),
        image_url=data['image_url']
    )
    db.session.add(new_category)
    db.session.commit()
    
    return jsonify({
        'message': 'Category added successfully',
        'category': {
            'id': new_category.id,
            'name': new_category.name,
            'description': new_category.description,
            'image_url': new_category.image_url
        }
    }), 201

@app.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = ServiceCategory.query.get(category_id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    db.session.delete(category)
    db.session.commit()
    
    return jsonify({'message': 'Category deleted successfully'}), 200

@app.route('/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    category = ServiceCategory.query.get(category_id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    data = request.json
    category.name = data.get('name', category.name)
    category.description = data.get('description', category.description)
    category.image_url = data.get('image_url', category.image_url)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Category updated successfully',
        'category': {
            'id': category.id,
            'name': category.name,
            'description': category.description,
            'image_url': category.image_url
        }
    })



# Fetch category details
@app.route('/api/categories/<int:category_id>', methods=['GET'])
def get_category_details(category_id):
    category = ServiceCategory.query.get(category_id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    # Return the category details
    return jsonify({
        'id': category.id,
        'name': category.name,
        'description': category.description,
        'image_url': category.image_url
    })

@app.route('/api/categories/<int:category_id>/services', methods=['GET'])
def get_services_by_category(category_id):
    services = Service.query.filter_by(category_id=category_id).all()
    return jsonify([{
        'id': service.id,
        'name': service.name,
        'description': service.description,
        'base_price': service.base_price,
        'time_required': service.time_required,
        'image_url': service.image_url
    } for service in services])





@app.route('/services', methods=['GET'])
def get_services():
    services = Service.query.join(ServiceCategory).add_columns(
        Service.id, Service.name, Service.description, Service.base_price,
        Service.time_required, Service.image_url, ServiceCategory.name.label('category_name')
    ).all()
    return jsonify([
        {
            'id': service.id,
            'name': service.name,
            'description': service.description,
            'base_price': service.base_price,
            'time_required': service.time_required,
            'image_url': service.image_url,
            'category_name': service.category_name
        } for service in services
    ])

@app.route('/service_categories', methods=['GET'])
def get_categories_for_services():
    categories = ServiceCategory.query.all()
    return jsonify([
        {'id': category.id, 'name': category.name}
        for category in categories
    ])
# Add a new service
@app.route('/services', methods=['POST'])
def add_service():
    data = request.get_json()
    
    # Validate input data
    if not data.get('name') or not data.get('base_price') or not data.get('time_required'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if a service with the same name already exists
    existing_service = Service.query.filter_by(name=data['name']).first()
    if existing_service:
        return jsonify({'error': 'Service with this name already exists'}), 400
    
    try:
        new_service = Service(
            name=data['name'],
            description=data.get('description', ''),
            base_price=data['base_price'],
            time_required=data['time_required'],
            image_url=data.get('image_url', ''),
            category_id=data['category_id']
        )
        
        db.session.add(new_service)
        db.session.commit()
        
        return jsonify({
            'id': new_service.id,
            'name': new_service.name,
            'description': new_service.description,
            'base_price': new_service.base_price,
            'time_required': new_service.time_required,
            'image_url': new_service.image_url,
            'category_id': new_service.category_id
        }), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to add service'}), 500





# Update a service
@app.route('/services/<int:service_id>', methods=['PUT'])
def update_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return jsonify({'error': 'Service not found'}), 404
    
    # Get the data from the request
    data = request.get_json()
    
    # Update service fields
    service.name = data.get('name', service.name)  # Correctly update name
    service.description = data.get('description', service.description)
    service.base_price = data.get('base_price', service.base_price)  # Correct field name
    service.time_required = data.get('time_required', service.time_required)  # Correct field name
    service.image_url = data.get('image_url', service.image_url)
    service.category_id = data.get('category_id', service.category_id)
    
    # Commit the changes to the database
    db.session.commit()
    
    return jsonify({
        'id': service.id,
        'name': service.name,
        'description': service.description,
        'base_price': service.base_price,
        'time_required': service.time_required,
        'image_url': service.image_url,
        'category_id': service.category_id
    })



    # Delete a service
@app.route('/services/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return jsonify({'error': 'Service not found'}), 404
    
    # Delete the service
    db.session.delete(service)
    db.session.commit()
    
    return jsonify({'message': 'Service deleted successfully'})






################################# VERIFICATION #############################


# Route to get pending professionals
@app.route('/admindashboard/pending_verifications', methods=['GET'])
def get_pending_professionals():
    pending_professionals = ProfessionalProfile.query.filter_by(profile_status='Pending').all()
    professionals_list = [{
        "id": prof.id,
        "user": {
            "id": prof.user.id,
            "name": prof.user.username,
            "email": prof.user.email,
        },
        "service": {
            "id": prof.service.id,
            "name": prof.service.name
        },
        "document": {
            "url": prof.user.documents[0].document_url if prof.user.documents else None,
        }
    } for prof in pending_professionals]

    return jsonify({"professionals": professionals_list}), 200

# Route to get professional's verification details
@app.route('/admin/professional/<int:id>', methods=['GET'])
def get_professional_details(id):
    prof = ProfessionalProfile.query.filter_by(id=id).first()
    if not prof:
        return jsonify({"message": "Professional not found"}), 404

    data = {
        "id": prof.id,
        "user": {
            "name": prof.user.username,
            "email": prof.user.email
        },
        "service": {
            "name": prof.service.name
        },
        "document": {
            "document_url": prof.user.documents[0].document_url if prof.user.documents else "Not Provided"
        }
    }
    return jsonify({"professional": data}), 200

# Route to approve professional
@app.route('/admin/verify_professional/<int:id>', methods=['POST'])
def approve_professional(id):
    prof = ProfessionalProfile.query.get(id)
    if not prof:
        return jsonify({"message": "Professional not found"}), 404
    
    prof.is_verified = True
    prof.profile_status = "Verified"
    db.session.commit()

    return jsonify({"message": "Professional Verified"}), 200

# Route to reject professional
@app.route('/admin/reject_professional/<int:id>', methods=['POST'])
def reject_professional(id):
    prof = ProfessionalProfile.query.get(id)
    if not prof:
        return jsonify({"message": "Professional not found"}), 404
    
    data = request.json
    remark = data.get("remark", "No reason provided")
    
    prof.is_verified = False
    prof.profile_status = "Rejected"
    # Add remark if any
    prof.user.documents[0].remark = remark
    db.session.commit()
    
    return jsonify({"message": "Professional Rejected"}), 200






####################################### List User ########################################


@app.route('/api/users', methods=['GET'])
@auth_required('token')
def get_user():
        try:
            users = (
                User.query
                .join(User.roles)  # Join with the roles table through the relationship
                .filter(Role.name.in_(['User', 'Professional']))  # Filter users with roles "User" or "Professional"
                .all()
            )
            return users
        except Exception as e:
            print(f"Error fetching users: {e}")
            return jsonify({"error": "Internal server error"}), 500
        




############################################################## REPORTS ####################################


@app.route('/local-api/services-in-category')
def services_in_category():
    # Query the number of professionals registered in each service category
    services = db.session.query(
        ServiceCategory.name,
        db.func.count(ProfessionalProfile.id).label('num_professionals')
    ).join(Service, ServiceCategory.id == Service.category_id) \
     .join(ProfessionalProfile, ProfessionalProfile.service_id == Service.id) \
     .group_by(ServiceCategory.id).all()
    
    report_data = [{'label': service.name, 'value': service.num_professionals} for service in services]
    return jsonify(report_data)

@app.route('/local-api/registered-professionals')
def registered_professionals():
    # Query the number of registered professionals
    professionals = db.session.query(
        User.username,
        Service.name,
        db.func.count(ProfessionalProfile.id).label('num_professionals')
    ).join(ProfessionalProfile, ProfessionalProfile.user_id == User.id) \
     .join(Service, Service.id == ProfessionalProfile.service_id) \
     .group_by(User.id, Service.id).all()
    
    report_data = [{'label': f'{professional.username} - {professional.name}', 'value': professional.num_professionals}
                   for professional in professionals]
    return jsonify(report_data)

@app.route('/local-api/professionals-in-service')
def professionals_in_service():
    # Query professionals for a specific service and their average rating
    service_id = request.args.get('service_id')  # Expecting a service_id as query parameter
    professionals = db.session.query(
        ProfessionalProfile.id,
        User.username,
        db.func.avg(Review.rating).label('average_rating')
    ).join(User, User.id == ProfessionalProfile.user_id) \
     .join(Review, Review.professional_id == User.id) \
     .filter(ProfessionalProfile.service_id == service_id) \
     .group_by(ProfessionalProfile.id).all()

    report_data = [{'label': professional.username, 'value': professional.average_rating}
                   for professional in professionals]
    return jsonify(report_data)

@app.route('/local-api/review-of-services', methods=['GET'])
def get_review_of_services():
    data = (
        db.session.query(Service.name, db.func.round(db.func.avg(Review.rating), 0).label('avg_rating'))
        .join(ServiceRequest, Review.service_request_id == ServiceRequest.id)
        .join(Service, ServiceRequest.service_id == Service.id)
        .group_by(Service.name)
        .all()
    )
    response = [{"label": service, "value": int(avg_rating)} for service, avg_rating in data]
    return jsonify(response)


@app.route('/local-api/services-in-category', methods=['GET'])
def get_services_in_category():
    data = (
        db.session.query(ServiceCategory.name, db.func.count(Service.id).label('count'))
        .join(Service)
        .group_by(ServiceCategory.name)
        .all()
    )
    response = [{"label": category, "value": count} for category, count in data]
    return jsonify(response)



@app.route('/local-api/reviews', methods=['GET'])
def get_reviews():
    rating_filter = request.args.get('rating', type=int)
    query = (
        db.session.query(
            Review.id,
            Service.name.label('serviceName'),
            Service.id.label('serviceId'),
            Review.comments,
            Review.rating,
            User.username.label('username'),
            Review.customer_id.label('userId'),
            ProfessionalProfile.user_id.label('professionalId'),
            ProfessionalProfile.user_id.label('professionalName')
        )
        .join(ServiceRequest, Review.service_request_id == ServiceRequest.id)
        .join(Service, ServiceRequest.service_id == Service.id)
        .join(User, Review.customer_id == User.id)
        .join(ProfessionalProfile, Review.professional_id == ProfessionalProfile.user_id)
    )
    
    if rating_filter:
        query = query.filter(Review.rating == rating_filter)

    reviews = query.all()
    response = [{"id": review.id, "serviceName": review.serviceName, "serviceId": review.serviceId,
                 "comments": review.comments, "rating": review.rating, "username": review.username,
                 "userId": review.userId, "professionalId": review.professionalId, "professionalName": review.professionalName
                 } for review in reviews]
    return jsonify(response)



@app.route('/local-api/block-professional/<int:professional_id>', methods=['POST'])
def block_professional(professional_id):
    professional = ProfessionalProfile.query.get(professional_id)
    if professional:
        professional.profile_status = 'Blocked'
        db.session.commit()
        return jsonify({"message": "Professional blocked successfully"}), 200
    return jsonify({"message": "Professional not found"}), 404




@app.route('/local-api/block-user/<int:user_id>', methods=['POST'])
def block_user(user_id):
    user = User.query.get(user_id)
    if user:
        user.is_active = False  # Assuming you have an is_active column
        db.session.commit()
        return jsonify({"message": "User blocked successfully"}), 200
    return jsonify({"message": "User not found"}), 404




########################################### Professional #######################################
# Accept Request
@app.route('/local-api/requests/<int:request_id>/accept', methods=['POST'])
@login_required
def accept_request(request_id):
    request = ServiceRequest.query.get(request_id)
    if request and request.status == 'Pending':
        request.status = 'Accepted'
        db.session.commit()
        return jsonify({"message": "Request accepted successfully"}), 200
    return jsonify({"message": "Request not found or already processed"}), 404

# Get Requests
@app.route('/local-api/requests', methods=['GET'])
@login_required
def get_requests():
    professional_id = current_user.id
    requests = (
        db.session.query(
            ServiceRequest.id,
            Service.name.label('serviceName'),
            User.username.label('customerName'),
            ServiceRequest.requested_date.label('requestedDate'),
            ServiceRequest.status
        )
        .join(Service, ServiceRequest.service_id == Service.id)
        .join(User, ServiceRequest.customer_id == User.id)
        .filter(ServiceRequest.professional_id == professional_id)
    ).all()

    response = [
        {
            "id": req.id,
            "serviceName": req.serviceName,
            "customerName": req.customerName,
            "requestedDate": req.requestedDate.strftime('%Y-%m-%d'),
            "status": req.status
        }
        for req in requests
    ]
    return jsonify(response)

# Get Professional Profile
@app.route('/local-api/professional-profile', methods=['GET'])
@login_required
def get_professional_profile():
    professional_id = current_user.id
    profile = (
        db.session.query(
            ProfessionalProfile.id,
            Service.name.label('serviceName'),
            ProfessionalProfile.experience_years.label('experienceYears'),
            ProfessionalProfile.description,
            ProfessionalProfile.profile_status.label('status'),
            ProfessionalProfile.remark
        )
        .join(Service, ProfessionalProfile.service_id == Service.id)
        .filter(ProfessionalProfile.user_id == professional_id)
        .first()
    )

    if profile:
        return jsonify({
            "id": profile.id,
            "serviceName": profile.serviceName,
            "experienceYears": profile.experienceYears,
            "description": profile.description,
            "status": profile.status,
            "remark": profile.remark or "No remarks from admin",
        })
    return jsonify({"error": "Profile not found"}), 404

# Upload Document
@app.route('/local-api/upload-document', methods=['POST'])
@login_required
def upload_document():
    professional_id = current_user.id
    if 'document' not in request.files:
        return jsonify({"error": "No document uploaded"}), 400

    document = request.files['document']
    document.save(f'uploads/{professional_id}_{document.filename}')

    profile = ProfessionalProfile.query.filter_by(user_id=professional_id).first()
    if profile:
        profile.profile_status = 'Pending'
        db.session.commit()

    return jsonify({"message": "Document uploaded successfully"}), 200

# Get Dashboard Data
@app.route('/local-api/dashboard-data', methods=['GET'])
@login_required
def get_dashboard_data():
    professional_id = current_user.id

    new_requests_count = ServiceRequest.query.filter_by(
        professional_id=professional_id,
        status='New'
    ).count()

    completed_requests_count = ServiceRequest.query.filter_by(
        professional_id=professional_id,
        status='Completed'
    ).count()

    today = datetime.date.today()
    tomorrow = today + datetime.timedelta(days=1)
    current_requests = ServiceRequest.query.filter(
        ServiceRequest.professional_id == professional_id,
        ServiceRequest.request_date.in_([today, tomorrow])
    ).all()

    current_requests_data = [
        {
            "id": request.id,
            "serviceName": request.service.name,
            "requestDate": request.request_date.strftime('%Y-%m-%d'),
            "customerName": f"{request.customer.first_name} {request.customer.last_name}"
        }
        for request in current_requests
    ]

    return jsonify({
        "newRequests": new_requests_count,
        "completedRequests": completed_requests_count,
        "currentRequests": current_requests_data,
    })