from flask import Flask 
from application.database import db 
from application.models import User, Role 
from application.resources import api
from application.config import LocalDevelopmentConfig,ProductionConfig
from flask_security import Security, SQLAlchemyUserDatastore
from werkzeug.security import generate_password_hash
from application.celery_init import celery_init_app
from celery.schedules import crontab
from flask_caching import Cache
from flask import Flask, send_from_directory
import os

app = Flask(__name__)
# Serve your built frontend
@app.route("/")
def index():
    return send_from_directory("static/dist", "index.html")

@app.route("/assets/<path:filename>")
def assets(filename):
    return send_from_directory("static/dist/assets", filename)


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
    api.init_app(app) #connecting app to api object (flask_restful_object)
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


from application.routes import *
@celery.on_after_finalize.connect 
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(minute = '*/2'),
        monthly_report.s(),
    )
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

