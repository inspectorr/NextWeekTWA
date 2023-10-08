from django.http import JsonResponse

from bot.middleware import telegram_auth


@telegram_auth
def auth_telegram_user(request):
    return JsonResponse({'secret_key': request.telegram_user.secret_key}, status=200)
