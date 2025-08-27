import os

print(">>> REDIS_URL =", os.getenv("REDIS_URL"))

import ssl
from celery import Celery

# Get Redis URL from environment
REDIS_URL = os.getenv("REDIS_URL")
if not REDIS_URL or not REDIS_URL.startswith(("redis://", "rediss://")):
    raise ValueError("Invalid REDIS_URL. Must start with redis:// or rediss://")

# Initialize Celery
celery = Celery(
    "worker",
    broker=REDIS_URL,
    backend=REDIS_URL,
    broker_use_ssl={"ssl_cert_reqs": ssl.CERT_NONE} if REDIS_URL.startswith("rediss://") else None,
    result_backend_use_ssl={"ssl_cert_reqs": ssl.CERT_NONE} if REDIS_URL.startswith("rediss://") else None,
)

# Handle SSL (for Upstash rediss://)
if REDIS_URL.startswith("rediss://"):
    ssl_opts = {"ssl_cert_reqs": ssl.CERT_NONE}
    celery.conf.update(
        broker_use_ssl=ssl_opts,
        result_backend_use_ssl=ssl_opts,
    )

# General Celery configuration
celery.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    enable_utc=True,
    timezone="UTC",
    broker_connection_retry_on_startup=True,
)
