from django.urls import path

from .views import (
    service_requests_list,
    service_request_detail,
)


urlpatterns = [
    # GET: View the logged-in customer's own requests.
    # POST: Create a new service request.
    path( "",service_requests_list, name="service_requests_list" ),
    path("<int:request_id>/", service_request_detail, name="service_request_detail"),
]
