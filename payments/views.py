import base64
from datetime import datetime

import requests
from decouple import config

from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import Payment, SubscriptionPlan, Subscription

# Create your views here.
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    user = request.user

    # Check whether the logged-in user is a provider
    if not hasattr(user, "account") or user.account.account_type != "provider":
        return Response(
            {
                "error": "Only service providers can initiate subscription payments."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    phone_number = request.data.get("phone_number")
    plan = request.data.get("plan")

    # Validate required fields
    if not phone_number:
        return Response(
            {
                "error": "Phone number is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if not plan:
        return Response(
            {
                "error": "Payment plan is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Available payment plans and their prices
    plan_amounts = {
        "provider_subscription": 1000
    }

    if plan not in plan_amounts:
        return Response(
            {
                "error": "Invalid payment plan."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    amount = plan_amounts[plan]

    # Create a pending payment record
    payment = Payment.objects.create(
        provider=user,
        phone_number=phone_number,
        plan=plan,
        amount=amount,
        status="pending"
    )

    return Response(
        {
            "message": "Payment initiated successfully.",
            "payment_id": payment.id,
            "phone_number": payment.phone_number,
            "plan": payment.plan,
            "amount": payment.amount,
            "status": payment.status,
            "next_step": "M-Pesa STK Push will be integrated next."
        },
        status=status.HTTP_201_CREATED
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_payments(request):
    user = request.user

    # Check whether the logged-in user is a provider
    if not hasattr(user, "account") or user.account.account_type != "provider":
        return Response(
            {
                "error": "Only service providers can view payment history."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Get payments belonging only to the logged-in provider
    payments = Payment.objects.filter(
        provider=user
    ).order_by("-created_at")

    payment_data = []

    for payment in payments:
        payment_data.append(
            {
                "id": payment.id,
                "phone_number": payment.phone_number,
                "plan": payment.plan,
                "amount": payment.amount,
                "status": payment.status,
                "mpesa_receipt_number": payment.mpesa_receipt_number,
                "transaction_date": payment.transaction_date,
                "created_at": payment.created_at,
            }
        )

    return Response(
        payment_data,
        status=status.HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def payment_detail(request, payment_id):
    user = request.user

    # Check whether the logged-in user is a provider
    if not hasattr(user, "account") or user.account.account_type != "provider":
        return Response(
            {
                "error": "Only service providers can view payment details."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Find the payment using its ID
    try:
        payment = Payment.objects.get(
            id=payment_id,
            provider=user
        )
    except Payment.DoesNotExist:
        return Response(
            {
                "error": "Payment not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(
        {
            "id": payment.id,
            "phone_number": payment.phone_number,
            "plan": payment.plan,
            "amount": payment.amount,
            "status": payment.status,
            "mpesa_checkout_request_id": payment.mpesa_checkout_request_id,
            "mpesa_receipt_number": payment.mpesa_receipt_number,
            "transaction_date": payment.transaction_date,
            "created_at": payment.created_at,
            "updated_at": payment.updated_at,
        },
        status=status.HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def payment_status(request, payment_id):
    user = request.user

    # Check whether the logged-in user is a provider
    if not hasattr(user, "account") or user.account.account_type != "provider":
        return Response(
            {
                "error": "Only service providers can check payment status."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Find the payment belonging to the logged-in provider
    try:
        payment = Payment.objects.get(
            id=payment_id,
            provider=user
        )
    except Payment.DoesNotExist:
        return Response(
            {
                "error": "Payment not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(
        {
            "payment_id": payment.id,
            "plan": payment.plan,
            "amount": payment.amount,
            "status": payment.status,
            "mpesa_receipt_number": payment.mpesa_receipt_number,
            "transaction_date": payment.transaction_date,
            "updated_at": payment.updated_at,
        },
        status=status.HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([AllowAny])
def mpesa_callback(request):
    callback_data = request.data

    # Get the callback information sent by M-Pesa
    stk_callback = callback_data.get("Body", {}).get("stkCallback", {})

    checkout_request_id = stk_callback.get("CheckoutRequestID")
    result_code = stk_callback.get("ResultCode")
    result_description = stk_callback.get("ResultDesc")

    # Validate the callback data
    if not checkout_request_id:
        return Response(
            {
                "error": "Checkout request ID is missing."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find the payment using the M-Pesa checkout request ID
    try:
        payment = Payment.objects.get(
            mpesa_checkout_request_id=checkout_request_id
        )
    except Payment.DoesNotExist:
        return Response(
            {
                "error": "Payment not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # ResultCode 0 means the payment was successful
    if result_code == 0:
        payment.status = "completed"
        payment.save()

        return Response(
            {
                "message": "Payment completed successfully.",
                "payment_id": payment.id,
                "status": payment.status,
            },
            status=status.HTTP_200_OK
        )

    # Any other result code means the payment failed or was cancelled
    payment.status = "failed"
    payment.save()

    return Response(
        {
            "message": "Payment failed or was cancelled.",
            "payment_id": payment.id,
            "status": payment.status,
            "reason": result_description,
        },
        status=status.HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_payment(request, payment_id):
    user = request.user

    # Check whether the logged-in user is a provider
    if not hasattr(user, "account") or user.account.account_type != "provider":
        return Response(
            {
                "error": "Only service providers can verify payments."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Find the payment belonging to the logged-in provider
    try:
        payment = Payment.objects.get(
            id=payment_id,
            provider=user
        )
    except Payment.DoesNotExist:
        return Response(
            {
                "error": "Payment not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Return the current payment status
    return Response(
        {
            "message": "Payment status retrieved successfully.",
            "payment_id": payment.id,
            "plan": payment.plan,
            "amount": payment.amount,
            "status": payment.status,
            "mpesa_receipt_number": payment.mpesa_receipt_number,
            "transaction_date": payment.transaction_date,
        },
        status=status.HTTP_200_OK
    )