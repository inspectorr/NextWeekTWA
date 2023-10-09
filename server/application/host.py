import os

from application import settings


def get_host():
    return os.getenv('PRODUCTION_HOST') if settings.PRODUCTION else os.getenv('DEV_TUNNEL_HOST')


def get_url():
    return f'https://{get_host()}'


def get_web_app_url(tg_owner_secret_key, date=None):
    return f'{get_url()}/{tg_owner_secret_key}/week/{date or "current"}/'
