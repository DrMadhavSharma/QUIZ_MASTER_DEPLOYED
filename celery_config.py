from celery import Celery
import os
import ssl
REDIS_URL = os.getenv("REDIS_URL")

if not REDIS_URL or not REDIS_URL.startswith(("redis://", "rediss://")):
    print("Invalid REDIS_URL")

# === Celery Setup ===
celery = Celery("tasks", broker=REDIS_URL, backend=REDIS_URL)

# if REDIS_URL.startswith("rediss://"):
#     celery.conf.broker_use_ssl = {"ssl_cert_reqs": ssl.CERT_NONE}
#     celery.conf.result_backend_use_ssl = {"ssl_cert_reqs": ssl.CERT_NONE}
# Apply SSL options
if REDIS_URL.startswith("rediss://"):
    celery.conf.update(
        broker_use_ssl=ssl_options,
        result_backend_use_ssl=ssl_options,
    )

celery.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    enable_utc=True,
    timezone="UTC",
)
broker_url = os.getenv("REDIS_URL")
result_backend = broker_url
broker_connection_retry_on_startup = True
# from celery import Celery
# import os
# import ssl

# # Get Redis URL
# REDIS_URL = os.getenv("REDIS_URL")

# if not REDIS_URL or not REDIS_URL.startswith(("redis://", "rediss://")):
#     raise ValueError("Invalid REDIS_URL. Must start with redis:// or rediss://")

# # === Celery Setup ===
# celery = Celery("tasks", broker=REDIS_URL, backend=REDIS_URL)

# # Handle SSL for rediss://
# if REDIS_URL.startswith("rediss://"):
#     celery.conf.broker_use_ssl = {"ssl_cert_reqs": ssl.CERT_NONE}
#     celery.conf.result_backend_use_ssl = {"ssl_cert_reqs": ssl.CERT_NONE}

# # Optional: retry on startup
# celery.conf.broker_connection_retry_on_startup = True

# celery_app.py
# import os
# import ssl
# from celery import Celery

# REDIS_URL = os.getenv("REDIS_URL")
# if not REDIS_URL:
#     raise SystemExit("REDIS_URL not set")

# celery = Celery("worker", broker=REDIS_URL, backend=REDIS_URL)

# # TLS for Upstash
# if REDIS_URL.startswith("rediss://"):
#     ssl_opts = {"ssl_cert_reqs": ssl.CERT_NONE}
#     celery.conf.update(
#         broker_use_ssl=ssl_opts,
#         result_backend_use_ssl=ssl_opts,
#     )

# celery.conf.update(
#     task_serializer="json",
#     result_serializer="json",
#     accept_content=["json"],
#     enable_utc=True,
#     timezone="UTC",
# )
