from django.shortcuts import render


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny #Registration must be available to people who are not logged in yet
from rest_framework.response import Response#sends data back to the person or application making the request.
from rest_framework import status #gives readable HTTP status codes
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegistrationSerializer,LoginSerializer, UserProfileSerializer, ProviderProfileSerializer
from rest_framework.permissions import IsAuthenticated
from .models import ProviderProfile

# Create your views here.
@api_view(["POST"]) #API endpoint that accepts POST requests
@permission_classes([AllowAny]) #allows users to register without logging in first

def register(request):
    serializer = RegistrationSerializer(data=request.data) #pass submitted data to the serializer

    if serializer.is_valid(): #validate the data
        user = serializer.save() #save the user and account

        return Response( #returns a success response
            {
                "message": "Account created successfully.",
                "username": user.username,
                "account_type": user.account.account_type,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )

@api_view(["POST"])
@permission_classes([AllowAny])

def login(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        return Response(
            serializer.validated_data,
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["POST"])

def logout(request):
    refresh_token = request.data.get("refresh")

    if not refresh_token:
        return Response(
            {
                "error": "Refresh token is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(
            {
                "message": "Logout successful."
            },
            status=status.HTTP_200_OK
        )

    except Exception:
        return Response(
            {
                "error": "Invalid or expired refresh token."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(["GET","PATCH"])#This endpoint accepts GET requests and PATCH
@permission_classes([IsAuthenticated])#Only logged-in users can access it.
def my_profile(request):
    if request.method == "GET":
       serializer = UserProfileSerializer(request.user)#This takes that user's information and prepares it for the response.

       return Response(
        serializer.data,
        status=status.HTTP_200_OK )  
     
    if request.method == "PATCH":
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True #allows update of only the field you want to change. You don't have to send every field
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
    