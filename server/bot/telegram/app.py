import logging
import os

from telegram import Update, Bot
from telegram.ext import Application

from bot.telegram.setup_handlers import setup_handlers


logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
# set higher logging level for httpx to avoid all GET and POST requests being logged
logging.getLogger("httpx").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)


def run():
    app = Application.builder().token(os.getenv('TELEGRAM_BOT_TOKEN')).build()
    setup_handlers(app)
    app.run_polling(
        allowed_updates=Update.ALL_TYPES,
        connect_timeout=10
    )
    app.idle()


def get_bot():
    return Bot(os.getenv('TELEGRAM_BOT_TOKEN'))
