from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import ProviderProfile, ProviderEnrolment
from .serializers import (
    ProviderEnrolmentSerializer,
    ProviderEnrolmentSubmissionSerializer,
)

from payments.models import Payment
from django.utils import timezone
from django.db import models
# Create your views here.

# View or update the logged-in provider's profile
@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def provider_profile(request):
    user = request.user

    # Check whether the logged-in user is a provider
    if user.account.account_type != "provider":
        return Response(
            {
                "error": "Only service providers can access this profile."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Find the provider profile belonging to the logged-in user
    try:
        profile = ProviderProfile.objects.get(user=user)
    except ProviderProfile.DoesNotExist:
        return Response(
            {
                "error": "Provider profile has not been created yet."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # GET: Return the provider's profile
    if request.method == "GET":
        serializer = ProviderEnrolmentSerializer(profile)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # PATCH: Update the provider's profile
    if request.method == "PATCH":
        serializer = ProviderEnrolmentSerializer(
            profile,
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


# View the enrolment application belonging to the logged-in provider
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_provider_enrolment(request):

    user = request.user

    # Only provider accounts can access provider enrolment
    if user.account.account_type != "provider":
        return Response(
            {
                "error": "Only service providers can access enrolment applications."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Find the enrolment application belonging to the logged-in user
    try:
        enrolment = ProviderEnrolment.objects.get(
            provider=user
        )

    except ProviderEnrolment.DoesNotExist:
        return Response(
            {
                "error": "You do not have an enrolment application yet."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ProviderEnrolmentSerializer(enrolment)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


# Update the enrolment application belonging to the logged-in provider
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_provider_enrolment(request):

    user = request.user

    # Only provider accounts can update enrolment applications
    if user.account.account_type != "provider":
        return Response(
            {
                "error": "Only service providers can update enrolment applications."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Find the enrolment application belonging to the logged-in user
    try:
        enrolment = ProviderEnrolment.objects.get(
            provider=user
        )

    except ProviderEnrolment.DoesNotExist:
        return Response(
            {
                "error": "You do not have an enrolment application yet."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Only draft applications can be edited
    if enrolment.status != "draft":
        return Response(
            {
                "error": "Only draft applications can be updated."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # partial=True allows the provider to update only selected fields
    serializer = ProviderEnrolmentSerializer(
        enrolment,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        updated_enrolment = serializer.save()

        return Response(
            {
                "message": "Enrolment application updated successfully.",
                "application": ProviderEnrolmentSerializer(updated_enrolment).data
            },
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# Withdraw the enrolment application belonging to the logged-in provider
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def withdraw_provider_enrolment(request):

    user = request.user

    # Only provider accounts can withdraw enrolment applications
    if user.account.account_type != "provider":
        return Response(
            {
                "error": "Only service providers can withdraw enrolment applications."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Find the enrolment application belonging to the logged-in user
    try:
        enrolment = ProviderEnrolment.objects.get(
            provider=user
        )

    except ProviderEnrolment.DoesNotExist:
        return Response(
            {
                "error": "You do not have an enrolment application yet."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Only draft or submitted applications can be withdrawn
    if enrolment.status not in ["draft", "submitted"]:
        return Response(
            {
                "error": "Only draft or submitted applications can be withdrawn."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Change the application status to withdrawn
    enrolment.status = "withdrawn"
    enrolment.save()

    serializer = ProviderEnrolmentSerializer(enrolment)

    return Response(
        {
            "message": "Enrolment application withdrawn successfully.",
            "application": serializer.data
        },
        status=status.HTTP_200_OK
    )

# List approved service providers with search and filtering
@api_view(["GET"])
@permission_classes([AllowAny])
def provider_directory(request):

    # Get all approved enrolment applications
    approved_enrolments = ProviderEnrolment.objects.filter(
        status="approved"
    )

    # Get the users belonging to approved providers
    approved_users = [
        enrolment.provider
        for enrolment in approved_enrolments
    ]

    # Get the profiles belonging to approved providers
    profiles = ProviderProfile.objects.filter(
        user__in=approved_users
    )

    # Read search and filter values from the URL
    search_query = request.query_params.get("search")
    category_query = request.query_params.get("category")
    location_query = request.query_params.get("location")

    # Search by business name, service category, or description
    if search_query:
        profiles = profiles.filter(
            models.Q(business_name__icontains=search_query)
            | models.Q(service_category__icontains=search_query)
            | models.Q(description__icontains=search_query)
        )

    # Filter by service category
    if category_query:
        profiles = profiles.filter(
            service_category__icontains=category_query
        )

    # Filter by location
    if location_query:
        profiles = profiles.filter(
            location__icontains=location_query
        )

    serializer = ProviderEnrolmentSerializer(
        profiles,
        many=True
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


# View one approved provider's public profile
@api_view(["GET"])
@permission_classes([AllowAny])
def public_provider_profile(request, provider_id):

    # Find the provider profile using its ID
    try:
        profile = ProviderProfile.objects.get(
            id=provider_id
        )

    except ProviderProfile.DoesNotExist:
        return Response(
            {
                "error": "Provider profile not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Check whether the provider has an enrolment application
    try:
        enrolment = ProviderEnrolment.objects.get(
            provider=profile.user
        )

    except ProviderEnrolment.DoesNotExist:
        return Response(
            {
                "error": "This provider is not available in the directory."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Only approved providers can be viewed publicly
    if enrolment.status != "approved":
        return Response(
            {
                "error": "This provider is not currently approved."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ProviderEnrolmentSerializer(profile)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )

# List service categories offered by approved providers
@api_view(["GET"])
@permission_classes([AllowAny])
def provider_categories(request):

    # Get all approved enrolment applications
    approved_enrolments = ProviderEnrolment.objects.filter(
        status="approved"
    )

    # Get the users belonging to approved providers
    approved_users = [
        enrolment.provider
        for enrolment in approved_enrolments
    ]

    # Get profiles belonging to approved providers
    profiles = ProviderProfile.objects.filter(
        user__in=approved_users
    )

    # Get service categories from the approved provider profiles
    categories = profiles.values_list(
        "service_category",
        flat=True
    ).distinct()

    return Response(
        categories,
        status=status.HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_enrolment(request):

    serializer = ProviderEnrolmentSubmissionSerializer(
        data=request.data
    )

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    data = serializer.validated_data

    enrolment, created = ProviderEnrolment.objects.update_or_create(
        provider=request.user,
        defaults={
            "business_name": data["business_name"],
            "service_category": data["service_category"],
            "description": data["description"],
            "location": data["location"],
            "years_of_experience": data["years_of_experience"],
            "status": "submitted",
            "payment_status": "pending",
            "payment_reference": data["transaction_code"],
        }
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

    return Response(
        {
            "message": "Enrolment and payment submitted successfully. Awaiting admin review.",
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
            }
        },
        status=status.HTTP_201_CREATED
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_provider_enrolment(request, enrolment_id):
    # Only administrators can approve provider enrolments.
    if not request.user.is_staff:
        return Response(
            {"error": "Only administrators can approve provider enrolments."},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        enrolment = ProviderEnrolment.objects.get(id=enrolment_id)
    except ProviderEnrolment.DoesNotExist:
        return Response(
            {"error": "Provider enrolment not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Find the pending payment connected to this enrolment.
    payment = Payment.objects.filter(
        enrolment=enrolment,
        status="pending"
    ).order_by("-created_at").first()

    # If the enrolment was already approved, do not require another payment.
    if enrolment.status == "approved":
        payment = Payment.objects.filter(
            enrolment=enrolment,
            status="completed"
        ).order_by("-created_at").first()

        if not payment:
            return Response(
                {"error": "This enrolment is approved, but no completed payment was found."},
                status=status.HTTP_400_BAD_REQUEST
            )

    else:
        if not payment:
            return Response(
                {"error": "No pending payment was found for this enrolment."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mark the payment as completed.
        payment.status = "completed"
        payment.save()

        # Mark the enrolment as paid and approved.
        enrolment.payment_status = "paid"
        enrolment.status = "approved"
        enrolment.paid_at = timezone.now()
        enrolment.save()

    # Create the public provider profile if it does not already exist.
    provider_profile, created = ProviderProfile.objects.get_or_create(
        user=enrolment.provider,
        defaults={
            "business_name": enrolment.business_name,
            "service_category": enrolment.service_category,
            "description": enrolment.description,
            "location": enrolment.location,
            "years_of_experience": enrolment.years_of_experience,
            "phone_number": "",
            "is_available": True,
        }
    )

    return Response(
        {
            "message": "Provider enrolment approved and provider profile created successfully.",
            "enrolment": {
                "id": enrolment.id,
                "provider": enrolment.provider.id,
                "business_name": enrolment.business_name,
                "status": enrolment.status,
                "payment_status": enrolment.payment_status,
                "payment_reference": enrolment.payment_reference,
                "paid_at": enrolment.paid_at,
            },
            "payment": {
                "id": payment.id if payment else None,
                "provider": payment.provider.id if payment else None,
                "enrolment": payment.enrolment.id if payment else None,
                "amount": str(payment.amount) if payment else None,
                "transaction_code": payment.transaction_code if payment else None,
                "status": payment.status if payment else None,
            },
            "provider_profile": {
                "id": provider_profile.id,
                "user": provider_profile.user.id,
                "business_name": provider_profile.business_name,
                "service_category": provider_profile.service_category,
                "location": provider_profile.location,
                "created": created,
            },
        },
        status=status.HTTP_200_OK
    )