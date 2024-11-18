class Config():
    DEBUG = False
    SQL_ALCHEMY_TRACK_MODIFICATIONS = False


class LocalDevelopmentConfig(Config): 
        
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.sqlite3" 
    DEBUG = True 
    SECURITY_PASSWORD_HASH = 'bcrypt' 
    SECURITY_PASSWORD_SALT = 'newrepo123456'
    SECRET_KEY = "newprojectformad2byjhanviirawat"

    WTF_CDRF_ENABLED = False 
