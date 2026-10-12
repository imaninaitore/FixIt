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
