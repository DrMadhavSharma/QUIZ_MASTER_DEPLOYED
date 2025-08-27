web: gunicorn wsgi:app -b 0.0.0.0:$PORT
worker: celery -A app.celery worker --loglevel=info
beat: celery -A app.celery beat --loglevel INFO

