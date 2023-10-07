from django.db import models

from application.models import TimeStampModel


class Event(TimeStampModel):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    title = models.TextField(null=True, blank=True)
    remind_in_ms = models.IntegerField(null=True, blank=True)
    tg_author = models.ForeignKey(
        to='bot.TelegramUser',
        verbose_name='Event creator',
        related_name='author_of_events',
        on_delete=models.RESTRICT
    )
    tg_owner = models.ForeignKey(
        to='bot.TelegramUser',
        verbose_name='Calendar owner',
        related_name='owner_of_events',
        on_delete=models.RESTRICT
    )
    tg_participants = models.ManyToManyField(
        to='bot.TelegramUser',
        verbose_name='Participants',
        blank=True
    )

    def __str__(self):
        return f'Event {self.start_date}'
