from telegram import Update, WebAppInfo, MenuButtonWebApp
from telegram.ext import ContextTypes

from application.host import get_url
from bot.models import TelegramUser


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await TelegramUser.alogin(update.effective_user.to_dict())
    await update.effective_chat.set_menu_button(
        MenuButtonWebApp(
            text='Mini App',
            web_app=WebAppInfo(url=get_url())
        )
    )
    await update.message.reply_text('Welcome to the bot!')
