
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import ServiceRequest
from .serializers import ServiceRequestSerializer

from accounts.models import Account


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def service_requests_list(request):
    # GET: View requests belonging to the logged-in customer.
    if request.method == "GET":
        requests = ServiceRequest.objects.filter(
            customer=request.user
        ).order_by("-created_at")

        serializer = ServiceRequestSerializer(
            requests,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # POST: Create a new service request.
    serializer = ServiceRequestSerializer(
        data=request.data,
        context={"request": request}
    )

    if serializer.is_valid():
        service_request = serializer.save()

        response_serializer = ServiceRequestSerializer(
            service_request,
            context={"request": request}
        )

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
def service_request_detail(request, request_id):
    service_request = get_object_or_404(
        ServiceRequest,
        id=request_id
    )

    # GET: Only the customer or assigned provider can view the request.
    if request.method == "GET":
        if (
            request.user != service_request.customer
            and request.user != service_request.provider
        ):
            return Response(
                {
                    "error": (
                        "You do not have permission to view this request."
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ServiceRequestSerializer(
            service_request,
            context={"request": request}
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # PATCH: Update the request.
    if request.method == "PATCH":

        # Provider update: providers can only accept or reject
        # pending requests through this endpoint.
        if request.user == service_request.provider:
            submitted_fields = set(request.data.keys())

            if submitted_fields != {"status"}:
                return Response(
                    {
                        "error": (
                            "Providers can only update the request status."
                        )
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            new_status = request.data.get("status")

            if new_status not in ["accepted", "rejected"]:
                return Response(
                    {
                        "error": (
                            "Providers can only accept or reject "
                            "pending requests."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if service_request.status != "pending":
                return Response(
                    {
                        "error": (
                            "Only pending requests can be accepted "
                            "or rejected."
                        ),
                        "current_status": service_request.status
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            service_request.status = new_status
            service_request.save()

            serializer = ServiceRequestSerializer(
                service_request,
                context={"request": request}
            )

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        # Customer update.
        if request.user == service_request.customer:

            # Request details can only be edited while pending.
            if service_request.status != "pending":
                return Response(
                    {
                        "error": (
                            "Only pending requests can be edited. "
                            "Accepted requests can no longer be edited."
                        ),
                        "current_status": service_request.status
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Customers may edit request details, but not ownership,
            # status, timestamps, or other protected fields.
            allowed_fields = {
                "provider_id",
                "service_title",
                "description",
                "location",
                "preferred_date",
            }

            submitted_fields = set(request.data.keys())
            forbidden_fields = submitted_fields - allowed_fields

            if forbidden_fields:
                return Response(
                    {
                        "error": (
                            "You cannot update these fields: "
                            + ", ".join(sorted(forbidden_fields))
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer = ServiceRequestSerializer(
                service_request,
                data=request.data,
                partial=True,
                context={"request": request}
            )

            if serializer.is_valid():
                updated_request = serializer.save()

                response_serializer = ServiceRequestSerializer(
                    updated_request,
                    context={"request": request}
                )

                return Response(
                    response_serializer.data,
                    status=status.HTTP_200_OK
                )

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "error": (
                    "You do not have permission to update this request."
                )
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # DELETE: Preserve the existing cancellation behaviour.
    if request.method == "DELETE":

        if request.user != service_request.customer:
            return Response(
                {
                    "error": "Only the customer can cancel this request."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if service_request.status == "completed":
            return Response(
                {
                    "error": "A completed request cannot be cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        service_request.status = "cancelled"
        service_request.save()

        return Response(
            {
                "message": "Service request cancelled successfully."
            },
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

    if account.account_type != "provider":
        return Response(
            {
                "error": (
                    "Only service providers can view assigned requests."
                )
            },
            status=status.HTTP_403_FORBIDDEN
        )

    requests = ServiceRequest.objects.filter(
        provider=request.user
    ).order_by("-created_at")

    serializer = ServiceRequestSerializer(
        requests,
        many=True,
        context={"request": request}
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_service_request(request, request_id):
    service_request = get_object_or_404(
        ServiceRequest,
        id=request_id
    )

    if request.user != service_request.provider:
        return Response(
            {
                "error": (
                    "Only the assigned provider can accept this request."
                )
            },
            status=status.HTTP_403_FORBIDDEN
        )

    if service_request.status != "pending":
        return Response(
            {
                "error": "Only pending requests can be accepted.",
                "current_status": service_request.status
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    service_request.status = "accepted"
    service_request.save()

    serializer = ServiceRequestSerializer(
        service_request,
        context={"request": request}
    )

    return Response(
        {
            "message": "Service request accepted successfully.",
            "request": serializer.data
        },
        status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reject_service_request(request, request_id):
    service_request = get_object_or_404(
        ServiceRequest,
        id=request_id
    )

    if request.user != service_request.provider:
        return Response(
            {
                "error": (
                    "Only the assigned provider can reject this request."
                )
            },
            status=status.HTTP_403_FORBIDDEN
        )

    if service_request.status != "pending":
        return Response(
            {
                "error": "Only pending requests can be rejected.",
                "current_status": service_request.status
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    service_request.status = "rejected"
    service_request.save()

    serializer = ServiceRequestSerializer(
        service_request,
        context={"request": request}
    )

    return Response(
        {
            "message": "Service request rejected successfully.",
            "request": serializer.data
        },
        status=status.HTTP_200_OK
    )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_service_request_status(request, request_id):
    service_request = get_object_or_404(
        ServiceRequest,
        id=request_id
    )

    # Only the assigned provider can start the service.
    if request.user != service_request.provider:
        return Response(
            {
                "error": (
                    "Only the assigned provider can update this request."
                )
            },
            status=status.HTTP_403_FORBIDDEN
        )

    new_status = request.data.get("status")

    if not new_status:
        return Response(
            {"error": "The status field is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Providers may start work, but only customers can confirm completion.
    if new_status != "in_progress":
        return Response(
            {
                "error": (
                    "Providers can only move accepted requests "
                    "to in_progress. Customers must confirm completion."
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if service_request.status != "accepted":
        return Response(
            {
                "error": (
                    "Only accepted requests can be moved to in_progress."
                ),
                "current_status": service_request.status
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    service_request.status = "in_progress"
    service_request.save()

    serializer = ServiceRequestSerializer(
        service_request,
        context={"request": request}
    )

    return Response(
        {
            "message": "Service request status updated successfully.",
            "request": serializer.data
        },
        status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_service_request(request, request_id):
    service_request = get_object_or_404(
        ServiceRequest,
        id=request_id
    )

    # Only the customer who created the request can confirm completion.
    if request.user != service_request.customer:
        return Response(
            {
                "error": (
                    "Only the customer who owns this request "
                    "can confirm completion."
                )
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Customers can complete requests that are accepted or in progress.
    if service_request.status not in ["accepted", "in_progress"]:
        return Response(
            {
                "error": (
                    "Only accepted or in-progress requests "
                    "can be marked as completed."
                ),
                "current_status": service_request.status
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    service_request.status = "completed"
    service_request.save()

    serializer = ServiceRequestSerializer(
        service_request,
        context={"request": request}
    )

    return Response(
        {
            "message": (
                "Service request marked as completed successfully."
            ),
            "request": serializer.data
        },
        status=status.HTTP_200_OK
    )
