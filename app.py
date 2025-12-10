from flask import Flask 
from application.database import db 
from application.models import User, Role 
from application.config import LocalDevelopmentConfig,ProductionConfig
from flask_security import Security, SQLAlchemyUserDatastore
from werkzeug.security import generate_password_hash
from application.celery_init import celery_init_app
from celery.schedules import crontab
from flask_caching import Cache
from flask import Flask, send_from_directory
import os
from functools import wraps

# from flask_cach import init_cache

# app = Flask(__name__)


# Serve your built frontend
import ssl
cache = Cache() 
def init_cache(app):
    
    app.config["CACHE_TYPE"] = "RedisCache"
    app.config["CACHE_REDIS_URL"] = "redis://default:ARuJAAImcDEzNTMyMjA0N2M2ZTg0YmUwOWRmOTdlZDExNWE0NTYzNXAxNzA0OQ@heroic-tick-7049.upstash.io:6379"
    app.config["CACHE_DEFAULT_TIMEOUT"] = 300
    # Proper SSL config
    app.config["CACHE_OPTIONS"] = {
        "ssl_cert_reqs": ssl.CERT_NONE
    }
    cache.init_app(app)
    return cache
#creating app object and initializing with configuration settings
def create_app():
    app = Flask(__name__) #creation of flask object
    # Choose config based on environment
    if os.getenv("FLASK_ENV") == "production":
        app.config.from_object(ProductionConfig)
    else:
        app.config.from_object(LocalDevelopmentConfig)

    # Rest of your existing init...
    # app.config.from_object(LocalDevelopmentConfig) #rather than apllying every singleconfiguration present in 
                       # config.py, we are applying the configuration in a single line here using this class 
    db.init_app(app) #connecting app to database object
    # configuring security in the application
    datastore = SQLAlchemyUserDatastore(db, User, Role) #configuring security in the application by prefilling the fs_uniquefier,active .
    app.security = Security(app, datastore)
    # creates everything in a single context
    app.app_context().push()
    return app
#configured app is returned
app = create_app()
#configured celery_app is returned
celery = celery_init_app(app)
celery.autodiscover_tasks()
def cache_route(timeout=300, key_prefix="view"):
    """
    Decorator to cache GET requests with unique keys based on request path and query.
    """
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            # Use full path (includes query params) for uniqueness
            cache_key = f"{key_prefix}:{request.full_path}"

            cached = cache.get(cache_key)
            if cached:
                print(f"CACHE HIT: {cache_key}")
                return cached

            print(f"CACHE MISS: {cache_key}")
            response = f(*args, **kwargs)

            # Only cache successful responses
            if hasattr(response, "status_code"):
                if response.status_code == 200:
                    cache.set(cache_key, response, timeout=timeout)
            else:
                # Some of your routes return raw Flask responses (send_file/jsonify dict)
                cache.set(cache_key, response, timeout=timeout)

            return response
        return wrapped
    return decorator

# For arbitrary functions (DB calls, logic functions)
def get_redis_client():
    if hasattr(cache.cache, "_client"):
        return cache.cache._client
    elif hasattr(cache.cache, "_clients"):
        return cache.cache._clients[0]
    else:
        raise RuntimeError("No Redis client found in cache backend")

def cache_delete_pattern(prefix: str):
    try:
        client = get_redis_client()
        keys = client.keys(f"{prefix}:*")
        """
        Delete all cache keys starting with prefix.
        Example: cache_delete_pattern("quizes")
        """
        if keys:
            cache.delete_many(*keys)
            print(f"Deleted cache keys for prefix: {prefix}")
    except Exception as e:
        print(f"Cache deletion failed for {prefix}: {e}")


with app.app_context(): #creating context for app creation process 
    db.create_all() #creating database only if it doesnot exist 
    app.security.datastore.find_or_create_role(name = "admin", description = "Superuser of app") #creating role object for admin (checking whether it exists and if not create it)
    app.security.datastore.find_or_create_role(name = "user", description = "General user of app") #creating role object for user (checking whether it exists and if not create it)
    db.session.commit()
    if not app.security.datastore.find_user(email = "user0@admin.com"): #checking whether admin user exists
        app.security.datastore.create_user(email = "user0@admin.com", #creating user object for admin user
                                           username = "admin01",
                                           password = generate_password_hash("1234"),
                                           roles = ['admin'])
        
    if not app.security.datastore.find_user(email = "user1@user.com"): #checking whether general user exists
        app.security.datastore.create_user(email = "user1@user.com", #creating user object for general user
                                           username = "user01",
                                           password = generate_password_hash("1234"),
                                           roles = ['user'])
    db.session.commit()

# 1️⃣ Initialize cache first
cache = init_cache(app)

# 2️⃣ Now import your normal routes
from application.routes import *

# 3️⃣ Import resources (Flask-Restful)
from application.resources import api
api.init_app(app) #connecting app to api object (flask_restful_object)


@app.route("/")
def index():
    return send_from_directory("static/dist", "index.html")

@app.route("/assets/<path:filename>")
def assets(filename):
    return send_from_directory("static/dist/assets", filename)

# @celery.on_after_finalize.connect 
# def setup_periodic_tasks(sender, **kwargs):
#     sender.add_periodic_task(
#         crontab(minute = '*/2'),
#         monthly_report.s(),
#     )
# -------- QStash Schedule Setup --------
# QSTASH_URL = "https://qstash.upstash.io/v2/schedules"
# QSTASH_TOKEN = os.getenv("QSTASH_TOKEN")  # add in your environment

# def setup_qstash_schedule():
#     headers = {
#         "Authorization": f"Bearer {QSTASH_TOKEN}",
#         "Content-Type": "application/json"
#     }
#     data = {
#         "destination": "https://quiz-master-deployed.onrender.com/tasks/monthly_report",  # Flask task endpoint
#         "cron": "*/2 * * * *",  # every 2 minutes
#         "retries": 3,
#         "method": "POST"
#     }
#     r = requests.post("https://qstash.upstash.io/v2/schedules", json=data, headers=headers)
#     print("QStash schedule setup:", r.status_code, r.text)


# # Run once on startup
# setup_qstash_schedule()

import os
import redis

redis_url = os.getenv("REDIS_URL")
try:
    client = redis.StrictRedis.from_url(redis_url)
    print(client.ping())
except Exception as e:
    print(f"Redis connection failed: {e}")

if __name__ == "__main__":
    app.run(debug=app.config["DEBUG"])

