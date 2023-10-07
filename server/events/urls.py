from django.urls import path

import events.views as views

urlpatterns = [
    path('create/', views.EventCreateView.as_view(), name='create_event'),
]
