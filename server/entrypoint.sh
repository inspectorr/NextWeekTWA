#!/bin/sh
action=$1
if [ "$action" = "runserver" ]; then
  python manage.py migrate
  python manage.py collectstatic --no-input
  gunicorn \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --error-logfile - \
    --access-logfile - \
    --timeout 60 \
    --reload \
    application.wsgi:application
elif [ "$action" = "runbot" ]; then
  python manage.py runbot
elif [ "$action" = "runcelery" ]; then
  celery -A application worker --loglevel=INFO
fi
