from django.urls import path

from .views import (create_service_request,
                    service_requests_list,
                    )


urlpatterns = [
    # Create a new service request.
    path("", create_service_request, name="create_service_request"),
    path("", service_requests_list, name="service_requests_list"),
]
