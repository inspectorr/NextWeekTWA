from rest_framework import serializers

from bot.drf.serializers import TelegramUserDefault
from bot.models import TelegramUser
from events.models import Event


class EventCreateSerializer(serializers.ModelSerializer):
    tg_author = serializers.HiddenField(default=TelegramUserDefault())
    tg_owner = serializers.PrimaryKeyRelatedField(queryset=TelegramUser.objects.all(), default=TelegramUserDefault())

    class Meta:
        model = Event
        fields = ('start_date', 'end_date', 'title', 'tg_author', 'tg_owner', 'tg_participants')
