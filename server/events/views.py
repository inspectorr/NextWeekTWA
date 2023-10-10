from datetime import datetime

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.response import Response

from bot.drf.mixins import TelegramAuthViewMixin
from bot.models import TelegramUser
from events.models import Event
from events.notifications import EventCreateNotifier
from events.serializers import EventCreateSerializer, EventDetailSerializer


class EventCreateView(TelegramAuthViewMixin, CreateAPIView):
    serializer_class = EventCreateSerializer
    queryset = Event.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save()
        EventCreateNotifier.delay(event)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_serializer_context(self, *args, **kwargs):
        context = super().get_serializer_context(*args, **kwargs)
        tg_owner = get_object_or_404(TelegramUser, secret_key=self.kwargs['tg_owner_secret_key'])
        context.update({'tg_owner': tg_owner})
        return context


class EventListView(TelegramAuthViewMixin, ListAPIView):
    serializer_class = EventDetailSerializer

    def get_queryset(self):
        from_datetime = datetime.strptime(self.request.query_params.get('from_datetime'), '%Y-%m-%dT%H:%M:%S.%f%z')
        to_datetime = datetime.strptime(self.request.query_params.get('to_datetime'), '%Y-%m-%dT%H:%M:%S.%f%z')
        return Event.objects.select_related('tg_owner', 'tg_author').filter(
            tg_owner__secret_key=self.kwargs['tg_owner_secret_key'],
            start_date__range=[from_datetime, to_datetime]
        ).order_by('start_date')
