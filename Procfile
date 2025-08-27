web: gunicorn app:app -w 1 -b 0.0.0.0:$PORT
worker: celery -A app.celery worker --loglevel=info


