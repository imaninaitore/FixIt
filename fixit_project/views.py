from django.shortcuts import render


def home(request):
    return render(request, "home.html")

from django.shortcuts import render


def find_provider(request):
    return render(request, "find_provider.html")