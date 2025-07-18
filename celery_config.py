from celery import Celery
import os
import ssl
REDIS_URL = os.getenv("REDIS_URL")

if not REDIS_URL or not REDIS_URL.startswith(("redis://", "rediss://")):
    print("Invalid REDIS_URL")

# === Celery Setup ===
celery = Celery("tasks", broker=REDIS_URL, backend=REDIS_URL)

if REDIS_URL.startswith("rediss://"):
    celery.conf.broker_use_ssl = {"ssl_cert_reqs": ssl.CERT_NONE}
    celery.conf.result_backend_use_ssl = {"ssl_cert_reqs": ssl.CERT_NONE}
broker_url = os.getenv("REDIS_URL")
result_backend = broker_url
broker_connection_retry_on_startup = True
