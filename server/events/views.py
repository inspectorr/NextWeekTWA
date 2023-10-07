from rest_framework.generics import CreateAPIView

from bot.drf.mixins import TelegramViewMixin
from events.models import Event
from events.serializers import EventCreateSerializer


class EventCreateView(TelegramViewMixin, CreateAPIView):
    serializer_class = EventCreateSerializer
    queryset = Event.objects.all()
