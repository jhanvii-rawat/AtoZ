from flask import Flask
from backend.config import LocalDevelopmentConfig
from backend.models import db, User, Role
from flask_caching import Cache
from flask_security import Security, SQLAlchemyUserDatastore
from backend.resources import api


def createApp():
    app = Flask(__name__, template_folder='frontend', static_folder='frontend', static_url_path='/static')

    app.config.from_object(LocalDevelopmentConfig)
    
    #model init
    db.init_app(app)

    #flask-restful init
    api.init_app(app)


    
    
    #flask Security    
    datastore= SQLAlchemyUserDatastore(db,User, Role)
    app.security = Security(app, datastore=datastore, register_blueprint= False)
    
    app.app_context().push()


    return app


app = createApp()

import backend.initial_data
import backend.routes



if (__name__ == "__main__"):
    app.run()



