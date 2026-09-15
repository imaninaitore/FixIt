from django.urls import path

from .views import (
    service_requests_list,
    service_request_detail,
    provider_service_requests,
    accept_service_request,
    reject_service_request,
    update_service_request_status,
    complete_service_request
)


urlpatterns = [
    # GET: View the logged-in customer's own requests.
    # POST: Create a new service request.
    path( "",service_requests_list, name="service_requests_list" ),
    path( "provider/", provider_service_requests, name="provider_service_requests" ),
    path( "<int:request_id>/accept/", accept_service_request, name="accept_service_request" ),
    path( "<int:request_id>/reject/", reject_service_request, name="reject_service_request" ),
    path( "<int:request_id>/status/", update_service_request_status, name="update_service_request_status" ),
    path( "<int:request_id>/complete/", complete_service_request, name="complete_service_request" ),
    path("<int:request_id>/", service_request_detail, name="service_request_detail"),
]
