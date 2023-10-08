from django.core.management import BaseCommand

from bot.telegram.polling import run


class Command(BaseCommand):
    def handle(self, *args, **options):
        run()
