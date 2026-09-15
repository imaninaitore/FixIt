from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import ServiceRequest
from .serializers import ServiceRequestSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def service_requests_list(request):
    # GET: View requests belonging to the logged-in customer.
    if request.method == "GET":
        # Filter requests so the customer only sees their own.
        requests = ServiceRequest.objects.filter(
            customer=request.user
        ).order_by("-created_at")

        # Convert the request objects into JSON.
        serializer = ServiceRequestSerializer(
            requests,
            many=True
        )

        # Return the customer's requests.
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # POST: Create a new service request.
    if request.method == "POST":
        # Pass the submitted data to the serializer.
        serializer = ServiceRequestSerializer(
            data=request.data,
            context={"request": request}
        )

        # Check whether the submitted data is valid.
        if serializer.is_valid():
            # Save the request.
            # The serializer assigns the logged-in user as customer.
            service_request = serializer.save()

            # Serialize the saved request so it can be returned as JSON.
            response_serializer = ServiceRequestSerializer(
                service_request,
                context={"request": request}
            )

            # Return the newly created request.
            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED
            )

        # Return validation errors if the data is invalid.
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def service_request_detail(request, request_id):
    # Find the request using its ID.
    # Return 404 if the request does not exist.
    service_request = get_object_or_404(
        ServiceRequest,
        id=request_id
    )

    # GET: View one service request.
    if request.method == "GET":
        # Only the customer or assigned provider can view it.
        if (
            request.user != service_request.customer
            and request.user != service_request.provider
        ):
            return Response(
                {"error": "You do not have permission to view this request."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Convert the request into JSON.
        serializer = ServiceRequestSerializer(service_request)

        # Return the request details.
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # PATCH: Update a service request.
    if request.method == "PATCH":
        # Only the customer who created the request can update it.
        if request.user != service_request.customer:
            return Response(
                {"error": "Only the customer can update this request."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Prevent updates to finished or cancelled requests.
        if service_request.status in [
            "completed",
            "rejected",
            "cancelled"
        ]:
            return Response(
                {"error": "This request can no longer be updated."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Pass the new data to the serializer.
        serializer = ServiceRequestSerializer(
            service_request,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        # Check whether the submitted changes are valid.
        if serializer.is_valid():
            # Save the updated request.
            updated_request = serializer.save()

            # Return the updated request.
            return Response(
                ServiceRequestSerializer(updated_request).data,
                status=status.HTTP_200_OK
            )

        # Return validation errors.
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # DELETE: Cancel a service request.
    if request.method == "DELETE":
        # Only the customer who created the request can cancel it.
        if request.user != service_request.customer:
            return Response(
                {"error": "Only the customer can cancel this request."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Do not allow completed requests to be cancelled.
        if service_request.status == "completed":
            return Response(
                {"error": "A completed request cannot be cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mark the request as cancelled instead of deleting it.
        service_request.status = "cancelled"
        service_request.save()

        # Return a confirmation message.
        return Response(
            {"message": "Service request cancelled successfully."},
            status=status.HTTP_200_OK
        )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def provider_service_requests(request):
    # Check whether the logged-in user has a provider account.
    try:
        account = request.user.account
    except Account.DoesNotExist:
        return Response(
            {"error": "Account information not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Only users with the provider account type can access this endpoint.
    if account.account_type != "provider":
        return Response(
            {"error": "Only service providers can view assigned requests."},
            status=status.HTTP_403_FORBIDDEN
        )

    # Get only requests assigned to the logged-in provider.
    requests = ServiceRequest.objects.filter(
        provider=request.user
    ).order_by("-created_at")

    # Convert the request objects into JSON.
    serializer = ServiceRequestSerializer(
        requests,
        many=True
    )

    # Return the provider's assigned requests.
    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )
