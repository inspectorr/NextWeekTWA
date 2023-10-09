import logging

from asgiref.sync import async_to_sync

from bot.models import TelegramUser
from bot.telegram.app import app
from events.models import Event


class EventNotifier:
    event: Event

    def __init__(self, event: Event):
        self.event = event

    def notify(self):
        self._notify_user(self.event.tg_owner)
        if self.event.tg_owner != self.event.tg_author:
            self._notify_user(self.event.tg_author)

    def _notify_user(self, user: TelegramUser):
        # todo background
        try:
            async_to_sync(app.bot.send_message)(
                user.id,
                text=self._get_notification_text(user),
                parse_mode='MarkdownV2',
                pool_timeout=10
            )
        except Exception as e:
            logging.exception(e)

    def _get_notification_text(self, receiver: TelegramUser):
        e = self.event
        display_owner = receiver == e.tg_owner
        owner = f"[{e.tg_owner.first_name}](tg://user?id={e.tg_owner.id})'s" if not display_owner else 'your'
        display_author = receiver != e.tg_author
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
