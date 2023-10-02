from django.http import HttpResponse

from bot.middleware import telegram_auth


@telegram_auth
def auth_telegram_user(request):
    # all set up in the middleware :)
    # print(request.telegram_user)
    return HttpResponse(200)
