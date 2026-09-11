from django.shortcuts import render


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny #Registration must be available to people who are not logged in yet
from rest_framework.response import Response#sends data back to the person or application making the request.
from rest_framework import status #gives readable HTTP status codes

from .serializers import RegistrationSerializer


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