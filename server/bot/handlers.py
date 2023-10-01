import json

from telegram import KeyboardButton, ReplyKeyboardMarkup, ReplyKeyboardRemove, Update, WebAppInfo, MenuButtonWebApp
from telegram.ext import ContextTypes

from application.host import get_url


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    print(update.effective_user.username)
    print(update.effective_user.id)
    print(update.effective_user.first_name)
    await update.effective_chat.set_menu_button(
        MenuButtonWebApp(
            text='Mini App',
            web_app=WebAppInfo(url=get_url())
        )
    )
    await update.message.reply_text('Welcome to the bot!')
