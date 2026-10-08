from django.urls import path

from .views import (
    provider_reviews,
    review_detail,
    provider_rating_summary,
    my_reviews,
    pending_reviews,
)


urlpatterns = [
    path(
        "providers/<int:provider_id>/reviews/",
        provider_reviews,
        name="provider_reviews"
    ),

    path(
        "reviews/<int:review_id>/",
        review_detail,
        name="review_detail"
    ),

    path(
        "providers/<int:provider_id>/rating/",
        provider_rating_summary,
        name="provider_rating_summary"
    ),

    path(
        "my-reviews/",
        my_reviews,
        name="my_reviews"
    ),

    path(
        "pending/",
        pending_reviews,
        name="pending_reviews"
    ),
]
