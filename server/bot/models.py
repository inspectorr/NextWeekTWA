from asgiref.sync import sync_to_async
from django.db import models
from django.utils import timezone

from application.models import TimeStampModel


class TelegramUser(TimeStampModel):
    id = models.BigIntegerField(primary_key=True)
    username = models.TextField()
    first_name = models.TextField()
    last_name = models.TextField(null=True, blank=True)
    language_code = models.CharField(default='en')
    is_bot = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    last_login_at = models.DateTimeField(null=True)

    def __str__(self):
        return f'{self.username} (#{self.id})'

    @classmethod
    def login(cls, user_dict):
        user, was_created = cls.objects.update_or_create(
            id=user_dict.get('id'),
            defaults=user_dict
        )
        user.last_login_at = timezone.now()
        user.save()
        return user, was_created

    @classmethod
    def alogin(cls, *args, **kwargs):
        return sync_to_async(cls.login)(*args, **kwargs)
