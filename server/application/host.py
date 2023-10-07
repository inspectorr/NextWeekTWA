import hashlib
import os

from application import settings


def _get_dev_tunnel_host():
    subdomain = os.getenv('DEV_TUNNEL_SUBDOMAIN')
    if not subdomain:
        # let's generate it from hash of bot token and provided salt
        str_to_encode = os.getenv('TELEGRAM_BOT_TOKEN', '') + os.getenv('DEV_TUNNEL_SALT', '')
        hash_ = hashlib.sha256(str_to_encode.encode('utf-8')).hexdigest()
        subdomain = hash_[:10]
    return f'{subdomain}{os.getenv("DEV_TUNNEL_POSTFIX")}'


def get_host():
    return os.getenv('PRODUCTION_HOST') if settings.PRODUCTION else _get_dev_tunnel_host()


def get_url():
    return f'https://{get_host()}'
