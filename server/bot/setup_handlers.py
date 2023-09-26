from telegram.ext import CommandHandler, MessageHandler, Application, filters

from server.bot.example import start, web_app_data


def setup_handlers(app: Application):
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))
