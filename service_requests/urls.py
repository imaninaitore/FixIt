from django.urls import path

from .views import (
    service_requests_list,
    service_request_detail,
    provider_service_requests,
)


urlpatterns = [
    # GET: View the logged-in customer's own requests.
    # POST: Create a new service request.
    path( "",service_requests_list, name="service_requests_list" ),
    path( "provider/", provider_service_requests, name="provider_service_requests" ),
    path("<int:request_id>/", service_request_detail, name="service_request_detail"),
]
