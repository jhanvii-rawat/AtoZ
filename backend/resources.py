from flask_restful import Api, Resource, fields, marshal_with, reqparse
from backend.models import ServiceRequest, db
from flask_security import auth_required, current_user

api = Api(prefix='/api')

service_request_fields = {
    'id': fields.Integer,
    'service_id': fields.Integer,
    'customer_id': fields.Integer,
    'professional_id': fields.Integer,
    'date_of_request': fields.DateTime,
    'date_of_completion': fields.DateTime,
    'service_status': fields.String,
    'remarks': fields.String,
}

# Parser for creating/updating service requests
request_parser = reqparse.RequestParser()
request_parser.add_argument('service_id', type=int)
request_parser.add_argument('professional_id', type=int)
request_parser.add_argument('service_status', type=str)
request_parser.add_argument('remarks', type=str)
request_parser.add_argument('date_of_completion', type=str)

class Service_Request_API(Resource):
    """Handles operations for a specific service request."""

    @marshal_with(service_request_fields)
    @auth_required('token')
    def get(self, request_id):
        """Retrieve details of a specific service request."""
        try:
            request = ServiceRequest.query.get(request_id)
            if not request:
                return {"message": "Service request not found"}, 404
            return request
        except Exception as e:
            return {"message": f"Error: {str(e)}"}, 500

    @auth_required('token')
    def put(self, request_id):
        """Update a specific service request."""
        try:
            service_request = ServiceRequest.query.get(request_id)
            if not service_request:
                return {"message": "Service request not found"}, 404

            # Ensure only the owner can update the request
            if service_request.customer_id != current_user.id:
                return {"message": "Permission denied. You can only update your own requests."}, 403

            # Update the request with provided data
            args = request_parser.parse_args()
            if args.get('service_status'):
                service_request.service_status = args['service_status']
            if args.get('remarks'):
                service_request.remarks = args['remarks']
            if args.get('date_of_completion'):
                service_request.date_of_completion = args['date_of_completion']

            db.session.commit()
            return {"message": f"Service request with ID {request_id} updated successfully."}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error: {str(e)}"}, 500

    @auth_required('token')
    def delete(self, request_id):
        """Delete a specific service request (admin only)."""
        try:
            service_request = ServiceRequest.query.get(request_id)
            if not service_request:
                return {"message": "Service request not found"}, 404

            # Ensure only admins can delete requests
            if not current_user.has_role('admin'):
                return {"message": "Permission denied. Only admins can delete requests."}, 403

            db.session.delete(service_request)
            db.session.commit()
            return {"message": f"Service request with ID {request_id} deleted successfully."}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error: {str(e)}"}, 500


class Service_Request_List_API(Resource):
    """Handles operations for a list of service requests."""

    @marshal_with(service_request_fields)
    @auth_required('token')
    def get(self):
        """Retrieve a list of all service requests."""
        try:
            requests = ServiceRequest.query.all()
            return requests
        except Exception as e:
            return {"message": f"Error: {str(e)}"}, 500

    @auth_required('token')
    def post(self):
        """Create a new service request."""
        try:
            args = request_parser.parse_args()
            new_request = ServiceRequest(
                service_id=args['service_id'],
                customer_id=current_user.id,  # Associate the request with the current user
                professional_id=args.get('professional_id'),
                date_of_request=db.func.now(),
                service_status=args.get('service_status', 'Pending'),
                remarks=args.get('remarks')
            )

            db.session.add(new_request)
            db.session.commit()
            return {"message": "Service request created successfully", "request_id": new_request.id}, 201
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error: {str(e)}"}, 500


# Add resources to the API
api.add_resource(Service_Request_API, '/service_request/<int:request_id>')
api.add_resource(Service_Request_List_API, '/service_request')
