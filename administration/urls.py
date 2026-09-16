from django.urls import path

from .views import (admin_users,
                    admin_user_detail,
                    admin_user_status,
                    admin_enrolments,
                    admin_enrolment_detail,
                    admin_approve_enrolment,
                    admin_reject_enrolment,
                    admin_service_requests,
                    admin_payments,
                    admin_reports,
                    admin_dashboard,

                    )


urlpatterns = [
    path(  "users/",  admin_users,  name="admin-users" ),
     path( "users/<int:user_id>/",admin_user_detail,name="admin-user-detail" ),
      path( "users/<int:user_id>/status/", admin_user_status, name="admin-user-status"),
      path( "enrolments/", admin_enrolments,name="admin-enrolments"),
      path(  "enrolments/<int:enrolment_id>/",  admin_enrolment_detail,name="admin-enrolment-detail"),
      path( "enrolments/<int:enrolment_id>/approve/", admin_approve_enrolment,name="admin-approve-enrolment"),

      path(
        "enrolments/<int:enrolment_id>/reject/",
        admin_reject_enrolment,
        name="admin-reject-enrolment"
    ),

    # Platform management
    path(
        "requests/",
        admin_service_requests,
        name="admin-service-requests"
    ),

    path(
        "payments/",
        admin_payments,
        name="admin-payments"
    ),

    path(
        "reports/",
        admin_reports,
        name="admin-reports"
    ),

    path(
        "dashboard/",
        admin_dashboard,
        name="admin-dashboard"
    ),

]
