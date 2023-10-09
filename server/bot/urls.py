from django.urls import path

import bot.views as views

urlpatterns = [
    path('auth/', views.auth_telegram_user, name='auth_telegram_user'),
    path('webapp/', views.redirect_web_app, name='redirect_web_app')
]
