from django.urls import path

from .views import (
   provider_profile, 
   create_provider_enrolment, 
   my_provider_enrolment, 
   update_provider_enrolment, 
   withdraw_provider_enrolment,

    provider_directory,
    public_provider_profile,
    provider_categories ,
    submit_enrolment, 
    approve_provider_enrolment,
)

urlpatterns = [

    path("me/", provider_profile, name="provider_profile"),
    path("enrolment/", create_provider_enrolment, name="create_provider_enrolment", ),
    path( "enrolment/me/", my_provider_enrolment, name="my-provider-enrolment" ), 
    path( "enrolment/me/update/", update_provider_enrolment, name="update-provider-enrolment" ),
    path( "enrolment/submit/",submit_enrolment, name="submit_enrolment", ),
    path( "enrolment/me/withdraw/", withdraw_provider_enrolment, name="withdraw-provider-enrolment" ),

    path("", provider_directory, name="provider-directory"),
    path( "categories/", provider_categories, name="provider-categories"),
    path("<int:provider_id>/", public_provider_profile, name="public-provider-profile"),

    path(
    "enrolment/<int:enrolment_id>/approve/",
    approve_provider_enrolment,
    name="approve_provider_enrolment",
),
]