from django.urls import path

from .views import initiate_payment,my_payments


urlpatterns = [
    path("initiate/", initiate_payment, name="initiate-payment"),
     path("me/", my_payments, name="my-payments"),
]