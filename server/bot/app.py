import logging
import os

from telegram import Update
from telegram.ext import Application

from server.bot.setup_handlers import setup_handlers


logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
# set higher logging level for httpx to avoid all GET and POST requests being logged
logging.getLogger("httpx").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)


app = Application.builder().token(os.getenv('TELEGRAM_BOT_TOKEN')).build()

setup_handlers(app)


def run():
    app.run_polling(
        allowed_updates=Update.ALL_TYPES,
        connect_timeout=5
    )
