from asgiref.sync import async_to_sync

from application.celery import app
from bot.models import TelegramUser
from bot.telegram.app import get_bot
from events.models import Event


class EventCreateNotifier:
    event: Event

    def __init__(self, event: Event):
        self.event = event

    @classmethod
    def delay(cls, event):
        cls.run.delay(event.id, event.tg_owner.id)
        if event.tg_author != event.tg_owner:
            cls.run.delay(event.id, event.tg_author.id)

    @staticmethod
    @app.task
    def run(event_id, user_id):
        event = Event.objects.get(pk=event_id)
        user = TelegramUser.objects.get(pk=user_id)
        EventCreateNotifier(event).notify(user)

    def notify(self, user: TelegramUser):
        bot = get_bot()
        async_to_sync(bot.send_message)(
            user.id,
            text=self.get_notification_text(user),
            parse_mode='MarkdownV2',
            pool_timeout=10
        )

    def get_notification_text(self, user: TelegramUser):
        e = self.event
        display_owner = user == e.tg_owner
        owner = f"[{e.tg_owner.first_name}](tg://user?id={e.tg_owner.id})'s" if not display_owner else 'your'
        display_author = user != e.tg_author
        author = f"[{e.tg_author.first_name}](tg://user?id={e.tg_author.id})" if display_author else None
        start_date = e.start_date.strftime('%d %B, %Y')
        start_time = e.start_date.strftime('%H:%M')
        end_time = e.end_date.strftime('%H:%M')
        return (
            f'*New event on {owner} calendar:*' +
            (f'\n📝 {e.title}' if e.title else '') +
            f'\n🗓 {start_date}' +
            f'\n🕓 {start_time} to {end_time}' +
            (f'\n✍️ {author}' if display_author else '')
        )
