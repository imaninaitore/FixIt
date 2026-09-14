from django.shortcuts import render


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny #Registration must be available to people who are not logged in yet
from rest_framework.response import Response#sends data back to the person or application making the request.
from rest_framework import status #gives readable HTTP status codes
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import ProviderProfileSerializer,ProviderEnrolmentSerializer
from rest_framework.permissions import IsAuthenticated
from .models import ProviderProfile,ProviderEnrolment

# Create your views here.
@api_view(["GET"])
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
        provider_profile = ProviderProfile.objects.get(user=user)
    except ProviderProfile.DoesNotExist:
        return Response(
            {
                "error": "Provider profile has not been created yet."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ProviderProfileSerializer(provider_profile)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


 # Create an enrolment application for the logged-in provider
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_provider_enrolment(request):
    user = request.user

    # Check whether the logged-in user is a provider
    if user.account.account_type != "provider":
        return Response(
            {
                "error": "Only service providers can submit an enrolment application."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Prevent the same provider from creating another application
    if ProviderEnrolment.objects.filter(provider=user).exists():
        return Response(
            {
                "error": "You already have an enrolment application."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = ProviderEnrolmentSerializer(data=request.data)

    if serializer.is_valid():
        enrolment = serializer.save(provider=user)

        return Response(
            {
                "message": "Enrolment application created successfully.",
                "application": ProviderEnrolmentSerializer(enrolment).data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )   

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_provider_enrolment(request):

    user = request.user

    # Only provider accounts can submit enrolment applications
    if user.account.account_type != "provider":
        return Response(
            {
                "error": "Only provider accounts can submit an enrolment application."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Find the provider's enrolment application
    try:
        enrolment = ProviderEnrolment.objects.get(
            provider=user
        )

    except ProviderEnrolment.DoesNotExist:
        return Response(
            {
                "error": "You must create an enrolment application first."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Prevent submitting an application that is already under review
    if enrolment.status == "submitted":
        return Response(
            {
                "error": "This application has already been submitted for review."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Prevent submitting an already approved application
    if enrolment.status == "approved":
        return Response(
            {
                "error": "This application has already been approved."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Payment must be completed before submission
    if enrolment.payment_status != "paid":
        return Response(
            {
                "error": "You must pay the provider subscription before submitting your application."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Change the application status
    enrolment.status = "submitted"
    enrolment.save()

    serializer = ProviderEnrolmentSerializer(enrolment)

    return Response(
        {
            "message": "Provider enrolment application submitted for admin review.",
            "application": serializer.data
        },
        status=status.HTTP_200_OK
    )