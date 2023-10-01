from django.shortcuts import render

from bot.middleware import telegram_exempt


@telegram_exempt
def spa_view(request):
    return render(request, 'spa.html')
