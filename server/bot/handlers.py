import json

from telegram import KeyboardButton, ReplyKeyboardMarkup, ReplyKeyboardRemove, Update, WebAppInfo, MenuButtonWebApp
from telegram.ext import ContextTypes

from server.host import get_url


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
    await update.message.reply_text(
        'Welcome to the bot!',
        reply_markup=ReplyKeyboardMarkup.from_button(
            KeyboardButton(
                text='Open Mini App',
                web_app=WebAppInfo(url=get_url())
            )
        )
    )


async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    data = json.loads(update.effective_message.web_app_data.data)
    await update.message.reply_html(
        text=json.dumps(data),
        reply_markup=ReplyKeyboardRemove(),
    )
