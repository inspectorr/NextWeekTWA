from django.http import HttpResponse, HttpRequest

from bot.middleware import telegram_auth


@telegram_auth
def auth_telegram_user(request: HttpRequest):
    # all set up in the middleware :)
    return HttpResponse(200)
