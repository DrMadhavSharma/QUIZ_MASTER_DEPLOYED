from flask import Flask, jsonify
from flask_caching import Cache 
import sqlite3
import os

# app = Flask(__name__)

# # Flask-Caching configuration with Redis
# app.config['CACHE_TYPE'] = 'RedisCache' 
# app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # Cache timeout in seconds <-- this

cache = Cache() 
def init_cache(app):
    UPSTASH_REDIS_URL = os.getenv("UPSTASH_REDIS_URL")
    app.config["CACHE_TYPE"] = "RedisCache"
    app.config["CACHE_REDIS_URL"] = UPSTASH_REDIS_URL
    app.config["CACHE_DEFAULT_TIMEOUT"] = 300
    cache.init_app(app)
    return cache

# def get_db_connection():
#     conn = sqlite3.connect('quizmaster.sqlite3')  # Update with your actual database
#     conn.row_factory = sqlite3.Row
#     return conn

# @app.route('/api/getquiz', methods=['GET'])
# @cache.cached(timeout=300, key_prefix='QUIZRESOURCE') 
# def get_transactions():
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM Quiz")  # Update with actual table name
#     rows = cursor.fetchall()
#     conn.close()
    
#     quizzes = [dict(row) for row in rows]
#     return jsonify(quizzes)
# Decorator for routes or resource methods
def cache_route(timeout=300, key_prefix=None):
    def decorator(func):
        return cache.cached(timeout=timeout, key_prefix=key_prefix)(func)
    return decorator

# For arbitrary functions (DB calls, logic functions)
def cache_function(timeout=300):
    return cache.memoize(timeout)
# if __name__ == '__main__':
#     app.run(debug=True)