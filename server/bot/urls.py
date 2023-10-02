from django.urls import path

from bot.views import auth_telegram_user

urlpatterns = [
    path('auth/', auth_telegram_user, name='auth_telegram_user'),
]
