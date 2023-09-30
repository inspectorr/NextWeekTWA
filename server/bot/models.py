from django.db import models


class TelegramUser(models.Model):
    tgid = models.BigIntegerField(primary_key=True)
    username = models.TextField(null=True, blank=True)
    first_name = models.TextField(null=True, blank=True)
