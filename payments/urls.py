from django.urls import path

from .views import ( initiate_payment,
                     my_payments,
                     payment_detail,
                     payment_status,
                     mpesa_callback,
                     verify_payment,
                     mpesa_stk_push
                   )


urlpatterns = [
    path("initiate/", initiate_payment, name="initiate-payment"),
    path("me/", my_payments, name="my-payments"),
    path("mpesa/callback/", mpesa_callback, name="mpesa-callback"),
    path("<int:payment_id>/status/", payment_status, name="payment-status"),
     path("<int:payment_id>/verify/", verify_payment, name="verify-payment"),
    path("<int:payment_id>/", payment_detail, name="payment-detail"),

    path("mpesa/stk-push/", mpesa_stk_push, name="mpesa-stk-push"),
]