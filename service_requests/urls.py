from django.urls import path

from .views import create_service_request


urlpatterns = [
    # Create a new service request.
    path("", create_service_request, name="create_service_request"),
]
