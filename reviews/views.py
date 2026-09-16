from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Avg, Count

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Review
from .serializers import ReviewSerializer

from service_requests.models import ServiceRequest

# Create your views here.

@api_view(["POST", "GET"])
@permission_classes([IsAuthenticated])
def provider_reviews(request, provider_id):
    # Find the provider or return a 404 error.
    provider = get_object_or_404(
        User,
        id=provider_id
    )

    # GET: View all reviews received by this provider.
    if request.method == "GET":
        reviews = Review.objects.filter(
            provider=provider
        ).order_by("-created_at")

        serializer = ReviewSerializer(
            reviews,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # POST: Create a review for this provider.
    if request.method == "POST":
        # Get the service request ID from the request body.
        service_request_id = request.data.get("service_request_id")

        # Make sure the service request ID was provided.
        if not service_request_id:
            return Response(
                {
                    "error": "service_request_id is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find the service request.
        service_request = get_object_or_404(
            ServiceRequest,
            id=service_request_id
        )

        # Only the customer who created the request can review it.
        if service_request.customer != request.user:
            return Response(
                {
                    "error": "Only the customer who created the request can review it."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Make sure the request belongs to the provider in the URL.
        if service_request.provider != provider:
            return Response(
                {
                    "error": "This service request does not belong to this provider."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Reviews are only allowed after completion.
        if service_request.status != "completed":
            return Response(
                {
                    "error": "You can only review a completed service request.",
                    "current_status": service_request.status
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # One service request can only receive one review.
        if Review.objects.filter(
            service_request=service_request
        ).exists():
            return Response(
                {
                    "error": "This service request has already been reviewed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate the rating and comment.
        serializer = ReviewSerializer(
            data=request.data
        )

        if serializer.is_valid():
            review = Review.objects.create(
                customer=request.user,
                provider=provider,
                service_request=service_request,
                rating=serializer.validated_data["rating"],
                comment=serializer.validated_data.get("comment", "")
            )

            response_serializer = ReviewSerializer(review)

            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def review_detail(request, review_id):
    # Find the review or return a 404 error.
    review = get_object_or_404(
        Review,
        id=review_id
    )

    # GET: View one review.
    if request.method == "GET":
        serializer = ReviewSerializer(review)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # PATCH: Update own review.
    if request.method == "PATCH":
        if review.customer != request.user:
            return Response(
                {
                    "error": "Only the customer who wrote this review can update it."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ReviewSerializer(
            review,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # DELETE: Delete own review.
    if request.method == "DELETE":
        if review.customer != request.user:
            return Response(
                {
                    "error": "Only the customer who wrote this review can delete it."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        review.delete()

        return Response(
            {
                "message": "Review deleted successfully."
            },
            status=status.HTTP_200_OK
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def provider_rating_summary(request, provider_id):
    # Find the provider or return a 404 error.
    provider = get_object_or_404(
        User,
        id=provider_id
    )

    # Calculate the average rating and number of reviews.
    summary = Review.objects.filter(
        provider=provider
    ).aggregate(
        average_rating=Avg("rating"),
        total_reviews=Count("id")
    )

    # If the provider has no reviews, return zero values.
    average_rating = summary["average_rating"]

    if average_rating is None:
        average_rating = 0

    return Response(
        {
            "provider_id": provider.id,
            "provider_username": provider.username,
            "average_rating": round(float(average_rating), 2),
            "total_reviews": summary["total_reviews"]
        },
        status=status.HTTP_200_OK
    )
