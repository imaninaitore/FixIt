from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class ServiceRequest(models.Model):
    # These are the possible stages of a service request.
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    )

    # The customer who created the request.
    # If the user is deleted, their requests are also deleted.
    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="service_requests"
    )

    # The provider the customer wants to hire.
    # SET_NULL means the request remains even if the provider is deleted.
    # null=True and blank=True allow the provider to be absent if needed.
    provider = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_service_requests"
    )

    # A short name for the requested service.
    service_title = models.CharField(max_length=200)

    # A longer explanation of what the customer needs.
    description = models.TextField()

    # The location where the service is needed.
    location = models.CharField(max_length=255)

    # The date the customer would prefer the service.
    preferred_date = models.DateField()

    # The request starts as pending.
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    # Automatically records when the request is first created.
    created_at = models.DateTimeField(auto_now_add=True)

    # Automatically updates whenever the request is saved.
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # This is how the request will appear in Django admin.
        return f"{self.service_title} - {self.customer.username}"
