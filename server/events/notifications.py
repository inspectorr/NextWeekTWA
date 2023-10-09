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
        event = self.event
        is_owner = event.tg_owner == receiver
        owner_text = f"[{event.tg_owner.first_name}](tg://user?id={event.tg_owner.id})'s" if not is_owner else 'your'
        start_date = event.start_date.strftime('%d %B, %Y')
        start_time = event.start_date.strftime('%H:%M')
        end_time = event.end_date.strftime('%H:%M')
        return (
            f"🗓 New event on {owner_text} calendar:\n"
            f"{start_date}\n{start_time} to {end_time}"
        )
