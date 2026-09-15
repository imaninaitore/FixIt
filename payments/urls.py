from django.urls import path

from .views import ( initiate_payment,
                     my_payments,
                     payment_detail,
                   )


urlpatterns = [
    path("initiate/", initiate_payment, name="initiate-payment"),
    path("me/", my_payments, name="my-payments"),
      path("<int:payment_id>/", payment_detail, name="payment-detail"),
]