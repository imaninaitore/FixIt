from django.urls import path
from .views import payment_information

urlpatterns = [
    path(
        "information/",
        payment_information,
        name="payment_information"
    ),
]