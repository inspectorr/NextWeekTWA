from django.http import HttpResponse


async def auth_telegram_user(request):
    # all set up in the middleware :)
    return HttpResponse(200)
