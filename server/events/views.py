from datetime import datetime
from rest_framework.generics import CreateAPIView, ListAPIView

from bot.drf.mixins import TelegramAuthViewMixin
from bot.models import TelegramUser
from events.models import Event
from events.serializers import EventCreateSerializer, EventDetailSerializer


class TelegramOwnerContextMixin:
    def get_serializer_context(self, *args, **kwargs):
        context = super().get_serializer_context(*args, **kwargs)
        context.update({
            'tg_owner': TelegramUser.objects.get(secret_key=self.kwargs['tg_owner_secret_key'])
        })
        return context


class EventCreateView(TelegramOwnerContextMixin, TelegramAuthViewMixin, CreateAPIView):
    serializer_class = EventCreateSerializer
    queryset = Event.objects.all()


class EventListView(TelegramOwnerContextMixin, TelegramAuthViewMixin, ListAPIView):
    serializer_class = EventDetailSerializer

    def get_queryset(self):
        from_datetime = datetime.strptime(self.request.query_params.get('from_datetime'), '%Y-%m-%dT%H:%M:%S.%f%z')
        to_datetime = datetime.strptime(self.request.query_params.get('to_datetime'), '%Y-%m-%dT%H:%M:%S.%f%z')
        return Event.objects.select_related('tg_owner', 'tg_author').filter(
            tg_owner__secret_key=self.kwargs['tg_owner_secret_key'],
            start_date__range=[from_datetime, to_datetime]
        ).order_by('start_date')
