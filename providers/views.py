import os

from django.db import models, transaction
from django.http import FileResponse
from django.shortcuts import render
from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
    parser_classes,
)
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import ProviderProfile, ProviderEnrolment
from .serializers import (
    ProviderEnrolmentSerializer,
    ProviderEnrolmentSubmissionSerializer,
    ProviderProfileSerializer,
)

from payments.models import Payment


# Render the existing find-provider page.
def find_provider(request):
    return render(request, "find-provider.html")


# Check whether the logged-in user has a provider account.
def is_provider_user(user):
    account = getattr(user, "account", None)

    return (
        user.is_authenticated
        and account is not None
        and account.account_type == "provider"
    )


# View or update the logged-in provider's profile.
@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def provider_profile(request):
    user = request.user

    if not is_provider_user(user):
        return Response(
            {"error": "Only service providers can access this profile."},
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        profile = ProviderProfile.objects.get(user=user)
    except ProviderProfile.DoesNotExist:
        return Response(
            {"error": "Provider profile has not been created yet."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        serializer = ProviderProfileSerializer(profile)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    serializer = ProviderProfileSerializer(
        profile,
        data=request.data,
        partial=True,
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


# View the enrolment application belonging to the logged-in provider.
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_provider_enrolment(request):
    user = request.user

    if not is_provider_user(user):
        return Response(
            {
                "error": (
                    "Only service providers can access enrolment applications."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        enrolment = ProviderEnrolment.objects.get(provider=user)
    except ProviderEnrolment.DoesNotExist:
        return Response(
            {"error": "You do not have an enrolment application yet."},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = ProviderEnrolmentSerializer(enrolment)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )


# Update the enrolment application belonging to the logged-in provider.
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def update_provider_enrolment(request):
    user = request.user

    if not is_provider_user(user):
        return Response(
            {
                "error": (
                    "Only service providers can update enrolment applications."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        enrolment = ProviderEnrolment.objects.get(provider=user)
    except ProviderEnrolment.DoesNotExist:
        return Response(
            {"error": "You do not have an enrolment application yet."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if enrolment.status != "draft":
        return Response(
            {"error": "Only draft applications can be updated."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = ProviderEnrolmentSerializer(
        enrolment,
        data=request.data,
        partial=True,
    )

    if serializer.is_valid():
        updated_enrolment = serializer.save()

        return Response(
            {
                "message": "Enrolment application updated successfully.",
                "application": ProviderEnrolmentSerializer(
                    updated_enrolment
                ).data,
            },
            status=status.HTTP_200_OK,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


# Withdraw the enrolment application belonging to the logged-in provider.
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def withdraw_provider_enrolment(request):
    user = request.user

    if not is_provider_user(user):
        return Response(
            {
                "error": (
                    "Only service providers can withdraw enrolment applications."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        enrolment = ProviderEnrolment.objects.get(provider=user)
    except ProviderEnrolment.DoesNotExist:
        return Response(
            {"error": "You do not have an enrolment application yet."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if enrolment.status not in ["draft", "submitted"]:
        return Response(
            {
                "error": (
                    "Only draft or submitted applications can be withdrawn."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Keep the existing withdrawal behavior.
    enrolment.status = "withdrawn"
    enrolment.save(update_fields=["status", "updated_at"])

    return Response(
        {
            "message": "Enrolment application withdrawn successfully.",
            "application": ProviderEnrolmentSerializer(enrolment).data,
        },
        status=status.HTTP_200_OK,
    )


# List approved service providers with search and filtering.
@api_view(["GET"])
@permission_classes([AllowAny])
def provider_directory(request):
    approved_users = ProviderEnrolment.objects.filter(
        status="approved"
    ).values_list("provider_id", flat=True)

    profiles = ProviderProfile.objects.filter(
        user_id__in=approved_users
    )

    search_query = request.query_params.get("search")
    category_query = request.query_params.get("category")
    location_query = request.query_params.get("location")

    if search_query:
        profiles = profiles.filter(
            models.Q(business_name__icontains=search_query)
            | models.Q(service_category__icontains=search_query)
            | models.Q(description__icontains=search_query)
        )

    if category_query:
        profiles = profiles.filter(
            service_category__icontains=category_query
        )

    if location_query:
        profiles = profiles.filter(
            location__icontains=location_query
        )

    serializer = ProviderProfileSerializer(profiles, many=True)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )


# View an individual approved provider's public profile.
@api_view(["GET"])
@permission_classes([AllowAny])
def public_provider_profile(request, provider_id):
    try:
        profile = ProviderProfile.objects.get(id=provider_id)
    except ProviderProfile.DoesNotExist:
        return Response(
            {"error": "Provider profile not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        enrolment = ProviderEnrolment.objects.get(provider=profile.user)
    except ProviderEnrolment.DoesNotExist:
        return Response(
            {
                "error": (
                    "This provider is not available in the directory."
                )
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    if enrolment.status != "approved":
        return Response(
            {"error": "This provider is not currently approved."},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = ProviderProfileSerializer(profile)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )


# List service categories offered by approved providers.
@api_view(["GET"])
@permission_classes([AllowAny])
def provider_categories(request):
    approved_users = ProviderEnrolment.objects.filter(
        status="approved"
    ).values_list("provider_id", flat=True)

    categories = (
        ProviderProfile.objects.filter(user_id__in=approved_users)
        .values_list("service_category", flat=True)
        .distinct()
    )

    return Response(
        categories,
        status=status.HTTP_200_OK,
    )


# Submit a provider enrolment application and its payment information.
@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def submit_enrolment(request):
    if not is_provider_user(request.user):
        return Response(
            {"error": "Only service providers can submit enrolment applications."},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = ProviderEnrolmentSubmissionSerializer(
        data=request.data
    )

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    data = serializer.validated_data

    try:
        with transaction.atomic():
            # Prevent a second application/payment submission while an
            # earlier application is awaiting review or already approved.
            existing = ProviderEnrolment.objects.filter(
                provider=request.user
            ).first()

            if existing and existing.status in ["submitted", "approved"]:
                return Response(
                    {
                        "error": (
                            "You already have an application submitted "
                            "or approved."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            enrolment, created = ProviderEnrolment.objects.update_or_create(
                provider=request.user,
                defaults={
                    "business_name": data["business_name"],
                    "service_category": data["service_category"],
                    "description": data["description"],
                    "location": data["location"],
                    "years_of_experience": data["years_of_experience"],
                    "phone_number": data["phone_number"],
                    "referee_name": data["referee_name"],
                    "referee_email": data["referee_email"],
                    "referee_phone": data["referee_phone"],
                    "qualification_document": data[
                        "qualification_document"
                    ],
                    "status": "submitted",
                    "payment_status": "pending",
                    "payment_reference": data["transaction_code"],
                },
            )

            payment = Payment.objects.create(
                provider=request.user,
                enrolment=enrolment,
                phone_number=data["phone_number"],
                plan=data["plan"],
                amount=data["amount"],
                transaction_code=data["transaction_code"],
                payment_date=data["payment_date"],
                status="pending",
            )

    except Exception:
        # Log the underlying exception in the Django server logs.
        import logging

        logging.getLogger(__name__).exception(
            "Provider enrolment submission failed."
        )

        return Response(
            {
                "error": (
                    "The application could not be saved. "
                    "Please try again or contact the administrator."
                )
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response(
        {
            "message": (
                "Enrolment and payment submitted successfully. "
                "Awaiting admin review."
            ),
            "enrolment": ProviderEnrolmentSerializer(enrolment).data,
            "payment": {
                "id": payment.id,
                "provider": payment.provider.id,
                "enrolment": payment.enrolment.id,
                "phone_number": payment.phone_number,
                "plan": payment.plan,
                "amount": str(payment.amount),
                "transaction_code": payment.transaction_code,
                "payment_date": payment.payment_date,
                "status": payment.status,
            },
        },
        status=status.HTTP_201_CREATED,
    )


# Approve a provider enrolment.
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_provider_enrolment(request, enrolment_id):
    if not request.user.is_staff:
        return Response(
            {
                "error": (
                    "Only administrators can approve provider enrolments."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    with transaction.atomic():
        try:
            enrolment = ProviderEnrolment.objects.select_for_update().get(
                id=enrolment_id
            )
        except ProviderEnrolment.DoesNotExist:
            return Response(
                {"error": "Provider enrolment not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Require a payment that has already been approved.
        payment = Payment.objects.filter(
            enrolment=enrolment,
            status="completed",
        ).order_by("-created_at").first()

        if not payment:
            return Response(
                {
                    "error": (
                        "This enrolment cannot be approved because "
                        "no approved payment was found."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Allow an already-approved enrolment to return its existing
        # payment and profile information without changing the payment.
        if enrolment.status != "approved":
            if enrolment.status != "submitted":
                return Response(
                    {
                        "error": (
                            "Only submitted enrolment applications "
                            "can be approved."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            enrolment.status = "approved"
            enrolment.payment_status = "paid"

            if not enrolment.paid_at:
                enrolment.paid_at = timezone.now()

            enrolment.save(
                update_fields=[
                    "status",
                    "payment_status",
                    "paid_at",
                    "updated_at",
                ]
            )

        # Create the public provider profile if it does not already exist.
        provider_profile, created = ProviderProfile.objects.get_or_create(
            user=enrolment.provider,
            defaults={
                "business_name": enrolment.business_name,
                "service_category": enrolment.service_category,
                "description": enrolment.description,
                "location": enrolment.location,
                "years_of_experience": enrolment.years_of_experience,
                "phone_number": enrolment.phone_number,
                "is_available": True,
            },
        )

    return Response(
        {
            "message": (
                "Provider enrolment approved and provider profile "
                "created successfully."
            ),
            "enrolment": {
                "id": enrolment.id,
                "provider": enrolment.provider.id,
                "business_name": enrolment.business_name,
                "service_category": enrolment.service_category,
                "description": enrolment.description,
                "location": enrolment.location,
                "years_of_experience": enrolment.years_of_experience,
                "phone_number": enrolment.phone_number,
                "referee_name": enrolment.referee_name,
                "referee_email": enrolment.referee_email,
                "referee_phone": enrolment.referee_phone,
                "qualification_document": (
                    os.path.basename(enrolment.qualification_document.name)
                    if enrolment.qualification_document
                    else None
                ),
                "status": enrolment.status,
                "payment_status": enrolment.payment_status,
                "payment_reference": enrolment.payment_reference,
                "paid_at": enrolment.paid_at,
            },
            "payment": {
                "id": payment.id,
                "provider": payment.provider.id,
                "enrolment": payment.enrolment.id,
                "amount": str(payment.amount),
                "transaction_code": payment.transaction_code,
                "status": payment.status,
            },
            "provider_profile": {
                "id": provider_profile.id,
                "user": provider_profile.user.id,
                "business_name": provider_profile.business_name,
                "service_category": provider_profile.service_category,
                "location": provider_profile.location,
                "phone_number": provider_profile.phone_number,
                "created": created,
            },
        },
        status=status.HTTP_200_OK,
    )


# Download a qualification document.
# Only authenticated staff members can access this endpoint.
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def download_qualification_document(request, enrolment_id):
    if not request.user.is_staff:
        return Response(
            {
                "error": (
                    "Only administrators can access qualification documents."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        enrolment = ProviderEnrolment.objects.get(id=enrolment_id)
    except ProviderEnrolment.DoesNotExist:
        return Response(
            {"error": "Provider enrolment not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    document = enrolment.qualification_document

    if not document:
        return Response(
            {"error": "No qualification document was uploaded."},
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        document.open("rb")
        return FileResponse(
            document,
            as_attachment=True,
            filename=os.path.basename(document.name),
            content_type="application/octet-stream",
        )
    except (OSError, ValueError):
        return Response(
            {"error": "The qualification document could not be opened."},
            status=status.HTTP_404_NOT_FOUND,
        )
