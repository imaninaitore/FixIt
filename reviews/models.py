from django.db import models
from django.contrib.auth.models import User

from service_requests.models import ServiceRequest


class Review(models.Model):
    # The customer who writes the review.
    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="written_reviews"
    )

    # The provider receiving the review.
    provider = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="received_reviews"
    )

    # The completed service request being reviewed.
    # One service request can only have one review.
    service_request = models.OneToOneField(
        ServiceRequest,
        on_delete=models.CASCADE,
        related_name="review"
    )

    # A rating from 1 to 5.
    rating = models.PositiveIntegerField()

    # Written feedback from the customer.
    comment = models.TextField(blank=True)

    # Automatically records when the review is created.
    created_at = models.DateTimeField(auto_now_add=True)

    # Automatically updates when the review is edited.
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"{self.customer.username} reviewed "
            f"{self.provider.username} - {self.rating}/5"
        )
