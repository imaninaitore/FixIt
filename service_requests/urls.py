from django.urls import path

from .views import (create_service_request,
                    my_service_requests,
                    )


urlpatterns = [
    # Create a new service request.
    path("", create_service_request, name="create_service_request"),
    path("", my_service_requests, name="my_service_requests"),
]
