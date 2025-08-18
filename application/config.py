import os
from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:Quizdb2754@db.cxkvbniofjtutliwthal.supabase.co:5432/postgres"

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "sslmode": "require",
        "application_name": "render-app"  # optional, but helpful
    },
    pool_pre_ping=True  # helps prevent stale connections
)

class Config():
    DEBUG=False
    SQLALCHEMY_TRACK_MODIFICATIONS=True

class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI="sqlite:///quizmaster.sqlite3"
    DEBUG=True 
    # config for security
    SECRET_KEY = "this-is-a-secret-key" # helps us to encrypt user credentials in the  session
    SECURITY_PASSWORD_HASH = "bcrypt" # mechanism we will be using for encrypting password
    SECURITY_PASSWORD_SALT = "this-is-a-password-salt" # very much similar to secret_key,helps in hashing in password
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"



class ProductionConfig(Config):
    # Render sets DATABASE_URL automatically, we just use it
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///prod_fallback.sqlite3")
    DEBUG=True 
    # config for security
    SECRET_KEY = "this-is-a-secret-key" # helps us to encrypt user credentials in the  session
    SECURITY_PASSWORD_HASH = "bcrypt" # mechanism we will be using for encrypting password
    SECURITY_PASSWORD_SALT = "this-is-a-password-salt" # very much similar to secret_key,helps in hashing in password
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"
    
