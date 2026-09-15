from django.urls import path

from .views import payment_plans, initiate_payment


urlpatterns = [
    path("plans/", payment_plans, name="payment-plans"),
    path("initiate/", initiate_payment, name="initiate-payment"),
]