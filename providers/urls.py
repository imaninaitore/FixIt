from django.urls import path

from .views import (
   provider_profile, 
   create_provider_enrolment, 
   my_provider_enrolment, 
   update_provider_enrolment, 
   submit_provider_enrolment, 
   withdraw_provider_enrolment,
   provider_directory
)

urlpatterns = [

    path("me/", provider_profile, name="provider_profile"),
    path("enrolment/", create_provider_enrolment, name="create_provider_enrolment", ),
    path( "enrolment/me/", my_provider_enrolment, name="my-provider-enrolment" ), 
    path( "enrolment/me/", update_provider_enrolment, name="update-provider-enrolment" ),
    path( "enrolment/me/submit/",submit_provider_enrolment, name="submit_provider_enrolment", ),
    path( "enrolment/me/withdraw/", withdraw_provider_enrolment, name="withdraw-provider-enrolment" ),
    path("", provider_directory, name="provider-directory"),

]