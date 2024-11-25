class Config():
    DEBUG = False
    SQL_ALCHEMY_TRACK_MODIFICATIONS = False


class LocalDevelopmentConfig(Config): 
        
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.sqlite3" 
    DEBUG = True 
    SECURITY_PASSWORD_HASH = 'bcrypt' 
    SECURITY_PASSWORD_SALT = 'newrepo123456'
    SECRET_KEY = "newprojectformad2byjhanviirawat"

    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Token-Token'
    SECURITY_TOKEN_MAX_AGE = 3600

    # cache specific
    CACHE_TYPE =  "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 30
    CACHE_REDIS_PORT = 6379

    WTF_CSRF_ENABLED = False