from django.urls import path

from .views import admin_users


urlpatterns = [
    path(  "users/",  admin_users,  name="admin-users" ),
]