from django.urls import path

from .views import (
    provider_profile,
    create_provider_enrolment,
    submit_provider_enrolment,
)

urlpatterns = [
    
    path("me/", provider_profile, name="provider_profile"),
    path("enrolment/", create_provider_enrolment, name="create_provider_enrolment", ),
    path( "enrolment/me/submit/",submit_provider_enrolment, name="submit_provider_enrolment", ),

]