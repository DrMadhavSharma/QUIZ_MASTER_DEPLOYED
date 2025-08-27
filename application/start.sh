#!/bin/bash
set -e

# Start Celery worker
celery -A app.celery worker --loglevel=info
