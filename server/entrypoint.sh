#!/bin/sh

action=$1

if [ "$action" = "runserver" ]; then
  python manage.py migrate
  python manage.py runserver 0:8000

elif [ "$action" = "runbot" ]; then
  python manage.py runbot

fi
