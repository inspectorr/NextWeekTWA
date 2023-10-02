import hashlib
import hmac
import json
import os
from urllib.parse import unquote

from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from bot.models import TelegramUser


def telegram_auth(view_func):
    view_func.telegram_auth = True
    return csrf_exempt(view_func)


class TelegramWebAppAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_view(self, request: HttpRequest, view_func, view_args, view_kwargs):
        is_telegram_auth = getattr(view_func, 'telegram_auth', False)
        if not is_telegram_auth:
            return None

        token = request.headers.get('X-Telegram-Auth-Token')
        validated, user_dict = self.validate(token)
        if not validated:
            return HttpResponse(status=403)

        request.telegram_user, _ = TelegramUser.login(user_dict)

        return None

    @classmethod
    def validate(cls, token: str) -> (bool, dict):
        if not token:
            return False, None
        parsed_token = {key: value for key, value in (param.split('=') for param in unquote(token).split('&'))}
        control_hash = parsed_token.pop('hash')
        data_check_string = '\n'.join([f'{key}={parsed_token[key]}' for key in sorted(parsed_token.keys())])
        check_hash = hmac.new(
            key=cls._get_secret_key(),
            msg=data_check_string.encode(),
            digestmod=hashlib.sha256
        ).hexdigest()
        validated = hmac.compare_digest(control_hash, check_hash)
        user_dict = json.loads(parsed_token.get('user')) if validated else None
        return validated, user_dict

    @staticmethod
    def _get_secret_key() -> bytes:
        return hmac.new(
            key='WebAppData'.encode(),
            msg=os.getenv('TELEGRAM_BOT_TOKEN').encode(),
            digestmod=hashlib.sha256
        ).digest()
