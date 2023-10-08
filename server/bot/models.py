import hashlib
import os

from asgiref.sync import sync_to_async
from django.db import models
from django.utils import timezone

from application.host import get_url
from application.models import TimeStampModel


class TelegramUser(TimeStampModel):
    id = models.BigIntegerField(primary_key=True)
    secret_key = models.CharField(max_length=6, unique=True, null=True)
    username = models.TextField()
    first_name = models.TextField()
    last_name = models.TextField(null=True, blank=True)
    language_code = models.CharField(default='en')
    is_bot = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    last_login_at = models.DateTimeField(null=True)

    SAFE_FIELDS = ('username', 'first_name', 'last_name', 'language_code', 'is_bot', 'is_premium')

    def __str__(self):
        return f'{self.username} (#{self.id})'

    @staticmethod
    def generate_secret_key(tg_id):
        return hashlib.sha256(
            str(tg_id).encode() + os.getenv('TELEGRAM_BOT_TOKEN').encode() + str(timezone.now()).encode()
        ).hexdigest()[:6].upper()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.secret_key:
            self.secret_key = self.generate_secret_key(self.id)  # todo while
            self.save()

    @classmethod
    def login(cls, user_dict):
        tg_id = user_dict.get('id')
        defaults_dict = {key: user_dict[key] for key in cls.SAFE_FIELDS if key in user_dict}
        user, was_created = cls.objects.update_or_create(
            id=tg_id,
            defaults=defaults_dict
        )
        user.last_login_at = timezone.now()
        user.save()
        return user, was_created

    @classmethod
    def alogin(cls, *args, **kwargs):
        return sync_to_async(cls.login)(*args, **kwargs)

    def get_web_app_url(self):
        return f'{get_url()}/{self.secret_key}/week/current/'
