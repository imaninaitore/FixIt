from django.urls import path

from .views import( register,
                   login,
                   logout,
                   my_profile,
                   provider_profile,
                   create_provider_enrolment,
                   submit_provider_enrolment
                   )

from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    
    path("register/", register, name="register"),
    path("login/", login, name="login"),
    path("logout/", logout, name="logout"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", my_profile, name="my_profile"),
    path("providers/me/", provider_profile, name="provider_profile"),
    path("enrolment/", create_provider_enrolment, name="create_provider_enrolment"),
    path("enrolment/me/submit/",submit_provider_enrolment,name="submit_provider_enrolment"),
]