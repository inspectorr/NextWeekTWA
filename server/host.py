import hashlib
import os

from django.conf import settings


def _get_dev_host():
    str_to_encode = os.getenv('TELEGRAM_BOT_TOKEN') + os.getenv('APP_SALT')
    hash_ = hashlib.sha256(str_to_encode.encode('utf-8')).hexdigest()
    domain = hash_[:10]
    return f'https://{domain}{os.getenv("DEV_TUNNEL_HOST_POSTFIX")}/'


def get_host():
    return _get_dev_host() if settings.DEBUG else os.getenv('PRODUCTION_HOST')
