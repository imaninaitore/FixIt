from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Payment(models.Model):

    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("cancelled", "Cancelled"),
    ]

    PLAN_CHOICES = [
        ("provider_subscription", "Provider Subscription"),
    ]

    provider = models.ForeignKey( User, on_delete=models.CASCADE,  related_name="payments")

    phone_number = models.CharField(max_length=20)

    plan = models.CharField( max_length=100, choices=PLAN_CHOICES )

    amount = models.DecimalField(max_digits=10,decimal_places=2)

    status = models.CharField( max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending" )

    mpesa_checkout_request_id = models.CharField( max_length=255, blank=True, null=True)

    mpesa_receipt_number = models.CharField(  max_length=100,  blank=True,  null=True)

    transaction_date = models.DateTimeField(blank=True, null=True )

    created_at = models.DateTimeField( auto_now_add=True )

    updated_at = models.DateTimeField( auto_now=True )

    def __str__(self):
        return f"{self.provider.username} - {self.plan} - {self.status}"