from telegram import Update, WebAppInfo, MenuButtonWebApp
from telegram.ext import ContextTypes

from bot.models import TelegramUser


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user, _ = await TelegramUser.alogin(update.effective_user.to_dict())
    await update.effective_chat.set_menu_button(
        MenuButtonWebApp(
            text='Calendar',
            web_app=WebAppInfo(url=user.get_web_app_url())
        )
    )
    await update.message.reply_text('Welcome to the bot!')
