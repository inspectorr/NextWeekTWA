import sys

from django.core.management import BaseCommand

print(sys.path)
from server.bot.polling import run


class Command(BaseCommand):
    def handle(self, *args, **options):
        run()
