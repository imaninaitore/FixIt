from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class ProviderEnrolment(models.Model):

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("unpaid", "Unpaid"),
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("rejected", "Rejected"),
    ]

    provider = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="provider_enrolment"
    )

    business_name = models.CharField(max_length=255)
    service_category = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=255)
    years_of_experience = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft"
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="unpaid"
    )

    payment_reference = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    paid_at = models.DateTimeField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.business_name} - {self.provider.username}"