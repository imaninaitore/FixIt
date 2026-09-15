from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import ServiceRequestSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def service_requests_list(request):
    # Handle GET requests.
    # GET means the customer wants to view their own requests.
    if request.method == "GET":
        # Get only requests belonging to the logged-in user.
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

    # Handle POST requests.
    # POST means the customer wants to create a new request.
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

            # Return the newly created request.
            return Response(
                ServiceRequestSerializer(service_request).data,
                status=status.HTTP_201_CREATED
            )

        # Return validation errors if the data is invalid.
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
