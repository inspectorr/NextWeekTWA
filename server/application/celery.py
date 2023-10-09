import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'application.settings')

app = Celery('application')

app.config_from_object('application.settings', namespace='CELERY')
app.accept_content = ['application/json']
app.task_serializer = 'json'
app.result_serializer = 'json'

app.autodiscover_tasks()
