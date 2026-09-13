from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Account(models.Model):
    ACCOUNT_TYPES = (
        ("customer", "Customer"),
        ("provider", "provider"),
     )

    user = models.OneToOneField( User, on_delete=models.CASCADE)

    account_type = models.CharField( max_length=20,choices=ACCOUNT_TYPES )

    def __str__(self):
        return f"{self.user.username} - {self.account_type}"


# Stores additional information about a service provider
class ProviderProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="provider_profile"
    )

    business_name = models.CharField(max_length=150)
    service_category = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=150)
    years_of_experience = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.business_name} - {self.user.username}"    

# Stores a service provider's enrolment application
class ProviderEnrolment(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    )

    provider = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="provider_enrolment"
    )

    business_name = models.CharField(max_length=150)
    service_category = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=150)
    years_of_experience = models.PositiveIntegerField(default=0)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.business_name} - {self.status}"    