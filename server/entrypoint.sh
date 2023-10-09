#!/bin/sh
action=$1
if [ "$action" = "runserver" ]; then
  python manage.py migrate
  gunicorn --bind 0.0.0.0:8000 --reload application.wsgi:application
elif [ "$action" = "runbot" ]; then
  python manage.py runbot
elif [ "$action" = "runcelery" ]; then
  celery -A application worker --loglevel=INFO
fi
