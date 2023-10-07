from django.db import models

from application.models import TimeStampModel


class Event(TimeStampModel):
    title = models.TextField(null=True, blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    tg_participants = models.ManyToManyField(
        to='bot.TelegramUser',
        verbose_name='Participants',
        blank=True
    )
    tg_author = models.ForeignKey(
        to='bot.TelegramUser',
        verbose_name='Author',
        related_name='author_of_events',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    remind_in_ms = models.IntegerField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f'Event {self.start_date}'
