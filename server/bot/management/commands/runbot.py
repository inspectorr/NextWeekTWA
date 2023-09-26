from django.core.management import BaseCommand

from server.bot.app import run


class Command(BaseCommand):
    def handle(self, *args, **options):
        run()
