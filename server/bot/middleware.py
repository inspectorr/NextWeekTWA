import hashlib
import hmac
import os
from urllib.parse import unquote

from django.http import HttpRequest, HttpResponse


def telegram_exempt(view_func):
    view_func.telegram_exempt = True
    return view_func


def telegram_required(view_func):
    view_func.telegram_required = True
    return view_func


class TelegramWebAppAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_view(self, request: HttpRequest, view_func, view_args, view_kwargs):
        is_exempt = getattr(view_func, 'telegram_exempt', False)
        is_required = getattr(view_func, 'telegram_required', False)

        should_validate = is_required or not is_exempt
        if not should_validate:
            return None

        token = request.headers.get('X-Telegram-Auth-Token')

        if not token or not self.validate(token):
            return HttpResponse(status=403)

        return None

    @classmethod
    def validate(cls, token: str):
        parsed_token = {key: value for key, value in (param.split('=') for param in unquote(token).split('&'))}
        control_hash = parsed_token.pop('hash')
        data_check_string = '\n'.join([f'{key}={parsed_token[key]}' for key in sorted(parsed_token.keys())])
        secret_key = hmac.new(  # todo cache
            key='WebAppData'.encode(),
            msg=os.getenv('TELEGRAM_BOT_TOKEN').encode(),
            digestmod=hashlib.sha256
        ).digest()
        check_hash = hmac.new(
            key=secret_key,
            msg=data_check_string.encode(),
            digestmod=hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(control_hash, check_hash)
