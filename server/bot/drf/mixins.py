from bot.middleware import telegram_auth


class TelegramAuthViewMixin:
    @classmethod
    def as_view(cls, *args, **kwargs):
        return telegram_auth(super().as_view(*args, **kwargs))
