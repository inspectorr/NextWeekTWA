from django.urls import path

from . import views

urlpatterns = [
    path('auth/', views.auth_telegram_user, name='auth_telegram_user'),
]
