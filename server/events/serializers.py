from rest_framework import serializers

from bot.drf.serializers import TelegramUserDefault
from events.models import Event


class EventCreateSerializer(serializers.ModelSerializer):
    tg_author = serializers.HiddenField(default=TelegramUserDefault())

    class Meta:
        model = Event
        fields = ('start_date', 'end_date', 'tg_author', 'tg_participants')
