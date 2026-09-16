from django.urls import path

from .views import (
    provider_reviews,
    review_detail,
    provider_rating_summary,
)


urlpatterns = [
    # POST: Create a review for a provider.
    # GET: View all reviews for a provider.
    path("providers/<int:provider_id>/reviews/",provider_reviews,name="provider_reviews" ),

    # GET: View one review.
    # PATCH: Update own review.
    # DELETE: Delete own review.
    path( "reviews/<int:review_id>/", review_detail, name="review_detail" ),

    # GET: View a provider's rating summary.
    path( "providers/<int:provider_id>/rating/", provider_rating_summary, name="provider_rating_summary"),
]
