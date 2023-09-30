from django.http import HttpRequest, HttpResponse


class TelegramWebAppAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        response = self.get_response(request)

        # tg_auth = request.headers['X-Telegram-Auth']
        # self.parse_th_auth(tg_auth)

        return response

    def parse_th_auth(self, th_auth: str):
        print(th_auth)
