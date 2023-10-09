import os
from datetime import datetime

from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect

from application.host import get_web_app_url
from bot.middleware import telegram_auth
from bot.models import TelegramUser


@telegram_auth
def auth_telegram_user(request):
    return JsonResponse({
        'secret_key': request.telegram_user.secret_key,
        'config': {
            'TELEGRAM_BOT_USERNAME': os.getenv('TELEGRAM_BOT_USERNAME'),
            'TELEGRAM_WEB_APP_NAME': os.getenv('TELEGRAM_WEB_APP_NAME')
        }
    })


def redirect_web_app(request):
    start_params = request.GET.get('tgWebAppStartParam').split('-')
    if not start_params:
        return HttpResponse(status=404, content='Do not play with these links.')

    secret_key = start_params[0]
    if not TelegramUser.objects.filter(secret_key=secret_key).exists():
        return HttpResponse(status=404, content='Please stop trying to hack this app.')

    date_string = start_params[1] if len(start_params) > 1 else None
    if not date_string:
        return redirect(get_web_app_url(secret_key))

    try:
        date = datetime.strptime(date_string, '%Y%m%d')
        return redirect(get_web_app_url(secret_key, date.strftime('%Y-%m-%d')))
    except ValueError:
        return HttpResponse(status=400, content='Why are you passing wrong dates?')
