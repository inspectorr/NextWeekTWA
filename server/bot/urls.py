from django.urls import path

import bot.views as views

urlpatterns = [
    path('auth/', views.auth_telegram_user, name='auth_telegram_user'),
]
