from django.urls import path

from .views import( register,
                   login,
                   logout,
                   my_profile,
                   )

from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    
    path("register/", register, name="register"),
    path("login/", login, name="login"),
    path("logout/", logout, name="logout"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", my_profile, name="my_profile"),
]