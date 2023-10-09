from django.urls import path, include

import events.views as views

urlpatterns = [
    path('<str:tg_owner_secret_key>/', include([
        path('create/', views.EventCreateView.as_view(), name='create_event'),
        path('list/', views.EventListView.as_view(), name='list_events'),
    ]))
]
