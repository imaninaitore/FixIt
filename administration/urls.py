from django.urls import path

from .views import (admin_users,
                    admin_user_detail,
                    admin_user_status,

                    )


urlpatterns = [
    path(  "users/",  admin_users,  name="admin-users" ),
     path( "users/<int:user_id>/",admin_user_detail,name="admin-user-detail" ),
      path( "users/<int:user_id>/status/", admin_user_status, name="admin-user-status"),
]
