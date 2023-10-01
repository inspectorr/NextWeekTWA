from django.http import HttpResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def auth_telegram_user(request: HttpRequest):
    # all set up in the middleware :)
    return HttpResponse(200)
