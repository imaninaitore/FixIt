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

def get_mpesa_access_token():
    consumer_key = config("MPESA_CONSUMER_KEY")
    consumer_secret = config("MPESA_CONSUMER_SECRET")

    url = (
        "https://sandbox.safaricom.co.ke/"
        "oauth/v1/generate?grant_type=client_credentials"
    )

    response = requests.get(
        url,
        auth=(consumer_key, consumer_secret),
        timeout=30
    )

    response.raise_for_status()

    return response.json()["access_token"]

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mpesa_stk_push(request):
    if request.user.account.account_type != "provider":
        return Response(
            {"error": "Only providers can make subscription payments."},
            status=status.HTTP_403_FORBIDDEN
        )

    phone_number = request.data.get("phone_number")
    plan_id = request.data.get("plan_id")

    if not phone_number or not plan_id:
        return Response(
            {"error": "phone_number and plan_id are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        plan = SubscriptionPlan.objects.get(
            id=plan_id,
            is_active=True
        )
    except SubscriptionPlan.DoesNotExist:
        return Response(
            {"error": "Subscription plan not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Convert 07XXXXXXXX or 01XXXXXXXX to 2547XXXXXXXX or 2541XXXXXXXX
    phone_number = phone_number.replace(" ", "").replace("+", "")

    if phone_number.startswith("0"):
        phone_number = "254" + phone_number[1:]
    elif phone_number.startswith("7") or phone_number.startswith("1"):
        phone_number = "254" + phone_number

    if not phone_number.isdigit() or len(phone_number) != 12:
        return Response(
            {"error": "Enter a valid Kenyan phone number."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        access_token = get_mpesa_access_token()

        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        shortcode = config("MPESA_SHORTCODE")
        passkey = config("MPESA_PASSKEY")

        password_string = shortcode + passkey + timestamp

        password = base64.b64encode(
            password_string.encode("utf-8")
        ).decode("utf-8")

        payment = Payment.objects.create(
            provider=request.user,
            plan=plan,
            amount=plan.amount,
            status="pending"
        )

        payload = {
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(plan.amount),
            "PartyA": phone_number,
            "PartyB": shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": config("MPESA_CALLBACK_URL"),
            "AccountReference": f"FIXIT{payment.id}",
            "TransactionDesc": "FixIt subscription"
        }

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        mpesa_response = requests.post(
            "https://sandbox.safaricom.co.ke/"
            "mpesa/stkpush/v1/processrequest",
            json=payload,
            headers=headers,
            timeout=30
        )

        response_data = mpesa_response.json()

        if mpesa_response.status_code != 200:
            payment.status = "failed"
            payment.save()

            return Response(
                {
                    "error": "M-Pesa request failed.",
                    "details": response_data
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        payment.transaction_reference = response_data.get(
            "CheckoutRequestID"
        )
        payment.save()

        return Response(
            {
                "message": "STK Push sent. Check your phone and enter your M-Pesa PIN.",
                "payment_id": payment.id,
                "checkout_request_id": response_data.get(
                    "CheckoutRequestID"
                ),
                "mpesa_response": response_data
            },
            status=status.HTTP_200_OK
        )

    except requests.RequestException as error:
        return Response(
            {
                "error": "Could not connect to M-Pesa.",
                "details": str(error)
            },
            status=status.HTTP_502_BAD_GATEWAY
        )