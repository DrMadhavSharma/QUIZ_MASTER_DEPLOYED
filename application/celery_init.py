# from celery import Celery, Task

# def celery_init_app(app):
#     class FlaskTask(Task):
#         def __call__(self, *args: object, **kwargs: object):
#             with app.app_context():
#                 return self.run(*args, **kwargs)

#     celery_app = Celery(app.name, task_cls=FlaskTask)
#     celery_app.config_from_object('celery_config')
#     celery_app.set_default()
#     app.extensions["celery"] = celery_app
#     return celery_app

from celery import Celery, Task
from celery_config import CELERY_CONFIG

def celery_init_app(app):
    class FlaskTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    print(type(CELERY_CONFIG), CELERY_CONFIG)
    celery_app.config_from_object(CELERY_CONFIG, namespace=None)  # ✅ works with dict
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app
