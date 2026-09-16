from django.urls import path

from .views import (admin_users,
                    admin_user_detail,

                    )


urlpatterns = [
    path(  "users/",  admin_users,  name="admin-users" ),
     path( "users/<int:user_id>/",admin_user_detail,name="admin-user-detail" ),
]
