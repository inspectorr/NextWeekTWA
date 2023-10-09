class TelegramAuthUser:
    requires_context = True

    def __call__(self, serializer_field):
        return serializer_field.context['request'].telegram_user
