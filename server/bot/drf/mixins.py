from bot.middleware import telegram_auth


class TelegramAuthViewMixin:
    @classmethod
    def as_view(cls, *args, **kwargs):
        return telegram_auth(super().as_view(*args, **kwargs))


# class TelegramContextViewMixin:
#     def get_serializer_context(self, *args, **kwargs):
#         context = super().get_serializer_context(*args, **kwargs)
#         context.update({
#             'telegram_user': self.request.telegram_user
#         })
#         return context
#
#
# class TelegramViewMixin(TelegramContextViewMixin, TelegramAuthViewMixin):
#     pass
#
