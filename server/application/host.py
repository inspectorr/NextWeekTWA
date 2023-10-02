import hashlib
import os


def _get_dev_tunnel_host():
    str_to_encode = os.getenv('TELEGRAM_BOT_TOKEN') + os.getenv('DEV_TUNNEL_SALT')
    hash_ = hashlib.sha256(str_to_encode.encode('utf-8')).hexdigest()
    domain = hash_[:10]
    return f'{domain}{os.getenv("DEV_TUNNEL_HOST_POSTFIX")}'


def get_host():
    return _get_dev_tunnel_host() if True else os.getenv('PRODUCTION_HOST')


def get_url():
    return f'https://{get_host()}'
