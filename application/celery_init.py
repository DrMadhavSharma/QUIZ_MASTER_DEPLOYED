from celery import Celery, Task

def celery_init_app(app):
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object('celery_config')
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app

# application/celery_init.py
# import os
# import ssl
# from celery import Celery, Task

# def celery_init_app(app):
#     class FlaskTask(Task):
#         def __call__(self, *args: object, **kwargs: object):
#             with app.app_context():
#                 return self.run(*args, **kwargs)

#     redis_url = os.getenv("REDIS_URL")
#     if not redis_url:
#         raise RuntimeError("❌ REDIS_URL not set in environment")

#     print(">>> Using Redis URL:", redis_url)

#     celery_app = Celery(
#         app.name,
#         task_cls=FlaskTask,
#         broker=redis_url,
#         backend=redis_url,
#     )

#     # Upstash Redis uses TLS (rediss://)
#     if redis_url.startswith("rediss://"):
#         ssl_opts = {"ssl_cert_reqs": ssl.CERT_NONE}
#         celery_app.conf.update(
#             broker_use_ssl=ssl_opts,
#             result_backend_use_ssl=ssl_opts,
#         )

#     # Keep rest of config from celery_config.py
#     celery_app.config_from_object("celery_config", namespace="CELERY")

#     celery_app.set_default()
#     app.extensions["celery"] = celery_app
#     return celery_app



