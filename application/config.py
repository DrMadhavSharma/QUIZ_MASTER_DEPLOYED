# import os


# class Config():
#     DEBUG=False
#     SQLALCHEMY_TRACK_MODIFICATIONS=True

# class LocalDevelopmentConfig(Config):
#     SQLALCHEMY_DATABASE_URI="sqlite:///quizmaster.sqlite3"
#     DEBUG=True 
#     # config for security
#     SECRET_KEY = "this-is-a-secret-key" # helps us to encrypt user credentials in the  session
#     SECURITY_PASSWORD_HASH = "bcrypt" # mechanism we will be using for encrypting password
#     SECURITY_PASSWORD_SALT = "this-is-a-password-salt" # very much similar to secret_key,helps in hashing in password
#     WTF_CSRF_ENABLED = False
#     SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"



# class ProductionConfig(Config):
#     # Render sets DATABASE_URL automatically, we just use it
#     SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///prod_fallback.sqlite3")
#     DEBUG=True 
#     # config for security
#     SECRET_KEY = "this-is-a-secret-key" # helps us to encrypt user credentials in the  session
#     SECURITY_PASSWORD_HASH = "bcrypt" # mechanism we will be using for encrypting password
#     SECURITY_PASSWORD_SALT = "this-is-a-password-salt" # very much similar to secret_key,helps in hashing in password
#     WTF_CSRF_ENABLED = False
#     SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"
import os

def normalize_sqlalchemy_url(url: str) -> str:
    """
    Normalize Supabase connection string for SQLAlchemy:
    - Ensure driver prefix (postgresql+psycopg://).
    - Ensure sslmode=require is present.
    """
    if not url:
        return None

    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg://", 1)

    if "sslmode=" not in url:
        sep = "&" if "?" in url else "?"
        url = f"{url}{sep}sslmode=require"

    return url


class Config:
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///quizmaster.sqlite3"
    DEBUG = True 

    # Security configs
    SECRET_KEY = "this-is-a-secret-key"
    SECURITY_PASSWORD_HASH = "bcrypt"
    SECURITY_PASSWORD_SALT = "this-is-a-password-salt"
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"


class ProductionConfig(Config):
    # Normalize DATABASE_URL from environment (Render injects this)
    SQLALCHEMY_DATABASE_URI = normalize_sqlalchemy_url(
        os.environ.get("DATABASE_URL", "sqlite:///prod_fallback.sqlite3")
    )
    DEBUG = False  

    # Security configs
    SECRET_KEY = "this-is-a-secret-key"
    SECURITY_PASSWORD_HASH = "bcrypt"
    SECURITY_PASSWORD_SALT = "this-is-a-password-salt"
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"

    # SQLAlchemy Engine Options for Render + Supabase
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,   # Avoid broken connections
        "pool_recycle": 300,     # Refresh every 5 minutes
        "pool_size": 5,          # Safe default for free tiers
        "max_overflow": 5,
    }

