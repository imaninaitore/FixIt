from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import ServiceRequestSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_service_request(request):
    # Create a serializer using the data sent by the customer.
    serializer = ServiceRequestSerializer(
        data=request.data,
        context={"request": request}
    )

    # Check whether the submitted data is valid.
    if serializer.is_valid():
        # Save the service request.
        # The serializer automatically assigns the logged-in user
        # as the customer and sets the initial status to pending.
        service_request = serializer.save()

        # Return the newly created request as JSON.
        return Response(
            ServiceRequestSerializer(service_request).data,
            status=status.HTTP_201_CREATED
        )

    # If the submitted data is invalid, return the errors.
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_service_requests(request):
    # Get only the requests created by the currently logged-in user.
    # This prevents customers from seeing other customers' requests.
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
