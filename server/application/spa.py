from django.shortcuts import render

from server.bot.middleware import telegram_exempt


@telegram_exempt
def spa_view(request):
    return render(request, 'spa.html')
