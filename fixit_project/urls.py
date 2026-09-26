"""
URL configuration for fixit_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include

from .views import home,find_provider

urlpatterns = [
    
    path('admin/', admin.site.urls),

    #api endpoints
    path("api/auth/", include("accounts.urls")),
    path("api/providers/", include("providers.urls")),
    path("api/payments/", include("payments.urls")),
    path("api/requests/", include("service_requests.urls")),
    path( "api/reviews/", include("reviews.urls")),
    path( "api/messaging/", include("messaging.urls")),
     path( "api/admin/", include("administration.urls")),

     #pages
     path("", home, name="home"),
     path("providers/", find_provider, name="find_provider"),


]
