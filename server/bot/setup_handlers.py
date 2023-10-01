from telegram.ext import CommandHandler, Application

from bot.handlers import start


def setup_handlers(app: Application):
    app.add_handler(CommandHandler("start", start))
