from django.db import models
from django.contrib.auth.models import User
from providers.models import ProviderEnrolment


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

    provider = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    enrolment = models.ForeignKey(
        ProviderEnrolment,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    phone_number = models.CharField(max_length=20)

    plan = models.CharField(
        max_length=100,
        choices=PLAN_CHOICES
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    transaction_code = models.CharField(
        max_length=100,
        unique=True
    )

    payment_date = models.DateField(
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.provider.username} - {self.plan} - {self.status}"


class SubscriptionPlan(models.Model):

    name = models.CharField(max_length=100)

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    duration_days = models.PositiveIntegerField(
        default=30
    )

    is_active = models.BooleanField(
        default=True
    )

    def __str__(self):
        return f"{self.name} - KSh {self.amount}"