from django.shortcuts import render


def web_app_view(request):
    return render(request, 'web_app.html')
