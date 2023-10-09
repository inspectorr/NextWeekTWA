from rest_framework import serializers

from bot.drf.serializers import TelegramAuthUser
from events.models import Event


class TelegramEventOwner:
    requires_context = True

    def __call__(self, serializer_field):
        return serializer_field.context['tg_owner']


class EventCreateSerializer(serializers.ModelSerializer):
    tg_author = serializers.HiddenField(default=TelegramAuthUser())
    tg_owner = serializers.HiddenField(default=TelegramEventOwner())

    class Meta:
        model = Event
        fields = ('start_date', 'end_date', 'title', 'tg_author', 'tg_owner')


class EventDetailSerializer(serializers.ModelSerializer):
    is_participant = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()

    def get_is_participant(self, event):
        return event.is_participant(self.context['request'].telegram_user)

    def get_title(self, event):
        return event.title if self.get_is_participant(event) else None

    class Meta:
        model = Event
        fields = ('start_date', 'end_date', 'title', 'is_participant')
