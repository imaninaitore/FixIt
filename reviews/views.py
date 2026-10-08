from django.contrib.auth.models import User
from django.db.models import Avg, Count

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from service_requests.models import ServiceRequest

from .models import Review
from .serializers import ReviewSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def provider_reviews(request, provider_id):
    """
    GET:
        Return all reviews written for a specific provider.

    POST:
        Create a review for a specific provider.
    """

    try:
        provider = User.objects.get(id=provider_id)
    except User.DoesNotExist:
        return Response(
            {"detail": "Provider not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        reviews = Review.objects.filter(
            provider=provider
        ).order_by("-created_at")

        serializer = ReviewSerializer(reviews, many=True)

        return Response(serializer.data)

    service_request_id = request.data.get("service_request_id")

    if not service_request_id:
        return Response(
            {"detail": "service_request_id is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        service_request = ServiceRequest.objects.get(
            id=service_request_id
        )
    except ServiceRequest.DoesNotExist:
        return Response(
            {"detail": "Service request not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Make sure the logged-in customer owns this request.
    if service_request.customer != request.user:
        return Response(
            {
                "detail": (
                    "You can only review a service request "
                    "that belongs to you."
                )
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Make sure the request belongs to this provider.
    if service_request.provider != provider:
        return Response(
            {
                "detail": (
                    "This service request does not belong "
                    "to this provider."
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Only completed services can be reviewed.
    if service_request.status != "completed":
        return Response(
            {
                "detail": (
                    "You can only review completed service requests."
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # A service request can only have one review.
    if Review.objects.filter(
        service_request=service_request
    ).exists():
        return Response(
            {
                "detail": (
                    "This service request has already been reviewed."
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = ReviewSerializer(data=request.data)

    if serializer.is_valid():
        review = serializer.save(
            customer=request.user,
            provider=provider,
            service_request=service_request
        )

        return Response(
            ReviewSerializer(review).data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_reviews(request):
    """
    Return all reviews written by the currently logged-in customer.
    """

    reviews = Review.objects.filter(
        customer=request.user
    ).order_by("-created_at")

    serializer = ReviewSerializer(
        reviews,
        many=True
    )

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def pending_reviews(request):
    """
    Return completed service requests belonging to the current customer
    that have not yet been reviewed.
    """

    service_requests = (
        ServiceRequest.objects
        .filter(
            customer=request.user,
            status="completed"
        )
        .exclude(
            review__isnull=False
        )
        .select_related("provider")
        .order_by("-updated_at")
    )

    data = []

    for service_request in service_requests:
        data.append(
            {
                "id": service_request.id,
                "provider_id": (
                    service_request.provider.id
                    if service_request.provider
                    else None
                ),
                "provider_username": (
                    service_request.provider.username
                    if service_request.provider
                    else None
                ),
                "service_title": service_request.service_title,
                "description": service_request.description,
                "location": service_request.location,
                "preferred_date": service_request.preferred_date,
                "status": service_request.status,
                "created_at": service_request.created_at,
                "updated_at": service_request.updated_at,
            }
        )

    return Response(data)


@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def review_detail(request, review_id):
    """
    GET:
        Return one review.

    PATCH:
        Update the logged-in customer's own review.

    DELETE:
        Delete the logged-in customer's own review.
    """

    try:
        review = Review.objects.get(id=review_id)
    except Review.DoesNotExist:
        return Response(
            {"detail": "Review not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        serializer = ReviewSerializer(review)

        return Response(serializer.data)

    # Only the customer who wrote the review can edit/delete it.
    if review.customer != request.user:
        return Response(
            {
                "detail": (
                    "You can only modify your own reviews."
                )
            },
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == "PATCH":
        serializer = ReviewSerializer(
            review,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    review.delete()

    return Response(
        {"detail": "Review deleted successfully."},
        status=status.HTTP_204_NO_CONTENT
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def provider_rating_summary(request, provider_id):
    """
    Return the average rating and total number of reviews
    for a provider.
    """

    try:
        provider = User.objects.get(id=provider_id)
    except User.DoesNotExist:
        return Response(
            {"detail": "Provider not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    summary = Review.objects.filter(
        provider=provider
    ).aggregate(
        average_rating=Avg("rating"),
        total_reviews=Count("id")
    )

    average_rating = summary["average_rating"] or 0
    total_reviews = summary["total_reviews"] or 0

    return Response(
        {
            "provider_id": provider.id,
            "provider_username": provider.username,
            "average_rating": round(float(average_rating), 2),
            "total_reviews": total_reviews,
        }
    )
