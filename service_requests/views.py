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
