from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from providers.models import ProviderEnrolment,ProviderProfile
from accounts.models import Account
from service_requests.models import ServiceRequest
from payments.models import Payment
from django.db.models import Sum

from django.db import transaction
from django.utils import timezone

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_users(request):
    users = User.objects.all().order_by("-date_joined")

    user_data = []

    for user in users:
        user_data.append(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_active": user.is_active,
                "is_staff": user.is_staff,
                "date_joined": user.date_joined,
            }
        )

    return Response(
        {
            "count": len(user_data),
            "users": user_data,
        },
        status=status.HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_user_detail(request, user_id):
    user = get_object_or_404(User, id=user_id)

    account_type = None

    if hasattr(user, "account"):
        account_type = user.account.account_type

    return Response(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "account_type": account_type,
            "is_active": user.is_active,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
            "date_joined": user.date_joined,
            "last_login": user.last_login,
        },
        status=status.HTTP_200_OK
    )

@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def admin_user_status(request, user_id):
    user = get_object_or_404(User, id=user_id)

    is_active = request.data.get("is_active")

    if is_active is None:
        return Response(
            {
                "error": "is_active is required. Use true or false."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if not isinstance(is_active, bool):
        return Response(
            {
                "error": "is_active must be either true or false."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    user.is_active = is_active
    user.save()

    return Response(
        {
            "message": "User status updated successfully.",
            "user_id": user.id,
            "username": user.username,
            "is_active": user.is_active,
        },
        status=status.HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_enrolments(request):
    enrolments = ProviderEnrolment.objects.select_related(
        "provider"
    ).order_by("-id")

    enrolment_data = []

    for enrolment in enrolments:
        enrolment_data.append(
            {
                "id": enrolment.id,
                "provider": enrolment.provider.username,
                "provider_id": enrolment.provider_id,
                "business_name": enrolment.business_name,
                "service_category": enrolment.service_category,
                "location": enrolment.location,
                "phone_number": enrolment.phone_number,
                "status": enrolment.status,
                "payment_status": enrolment.payment_status,
                "created_at": enrolment.created_at,
            }
        )

    return Response(
        {
            "count": len(enrolment_data),
            "enrolments": enrolment_data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_enrolment_detail(request, enrolment_id):
    enrolment = get_object_or_404(
        ProviderEnrolment.objects.select_related("provider"),
        id=enrolment_id,
    )

    document_name = None

    if enrolment.qualification_document:
        document_name = enrolment.qualification_document.name.split("/")[-1]

    payments = Payment.objects.filter(
        enrolment=enrolment
    ).order_by("-created_at")

    payment_data = [
        {
            "id": payment.id,
            "phone_number": payment.phone_number,
            "plan": payment.plan,
            "amount": str(payment.amount),
            "transaction_code": payment.transaction_code,
            "payment_date": payment.payment_date,
            "status": payment.status,
            "created_at": payment.created_at,
        }
        for payment in payments
    ]

    return Response(
        {
            "id": enrolment.id,
            "provider": enrolment.provider.username,
            "provider_id": enrolment.provider_id,
            "provider_email": enrolment.provider.email,
            "business_name": enrolment.business_name,
            "service_category": enrolment.service_category,
            "description": enrolment.description,
            "location": enrolment.location,
            "years_of_experience": enrolment.years_of_experience,
            "phone_number": enrolment.phone_number,
            "referee_name": enrolment.referee_name,
            "referee_email": enrolment.referee_email,
            "referee_phone": enrolment.referee_phone,
            "qualification_document": document_name,
            "has_qualification_document": bool(
                enrolment.qualification_document
            ),
            "status": enrolment.status,
            "payment_status": enrolment.payment_status,
            "payment_reference": enrolment.payment_reference,
            "paid_at": enrolment.paid_at,
            "created_at": enrolment.created_at,
            "updated_at": enrolment.updated_at,
            "payments": payment_data,
        },
        status=status.HTTP_200_OK,
    )

# PATCH /api/admin/enrolments/<id>/approve/
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def admin_approve_enrolment(request, enrolment_id):
    enrolment = get_object_or_404(
        ProviderEnrolment,
        id=enrolment_id,
    )

    completed_payment_exists = Payment.objects.filter(
        enrolment=enrolment,
        status="completed",
    ).exists()

    if not completed_payment_exists:
        return Response(
            {
                "error": (
                    "This enrolment cannot be approved until its "
                    "payment has been verified and approved."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    enrolment.status = "approved"
    enrolment.save(update_fields=["status", "updated_at"])

    return Response(
        {
            "message": "Provider enrolment approved successfully.",
            "id": enrolment.id,
            "provider": enrolment.provider.username,
            "status": enrolment.status,
        },
        status=status.HTTP_200_OK,
    )

# PATCH /api/admin/enrolments/<id>/reject/
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def admin_reject_enrolment(request, enrolment_id):
    enrolment = get_object_or_404(
        ProviderEnrolment,
        id=enrolment_id
    )

    enrolment.status = "rejected"
    enrolment.save()

    return Response(
        {
            "message": "Provider enrolment rejected successfully.",
            "id": enrolment.id,
            "provider": enrolment.provider.username,
            "status": enrolment.status,
        },
        status=status.HTTP_200_OK
    )

# GET /api/admin/requests/
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_service_requests(request):
    service_requests = ServiceRequest.objects.all().order_by("-id")

    request_data = []

    for service_request in service_requests:
        request_data.append(
            {
                "id": service_request.id,
                "service_title": service_request.service_title,
                "status": service_request.status,
                "created_at": service_request.created_at,
            }
        )

    return Response(
        {
            "count": len(request_data),
            "service_requests": request_data,
        },
        status=status.HTTP_200_OK
    )


# GET /api/admin/payments/
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_payments(request):
    payments = Payment.objects.all().order_by("-id")

    payment_data = []

    for payment in payments:
        payment_data.append(
            {
                "id": payment.id,
                "provider_id": payment.provider.id,
                "provider_username": payment.provider.username,
                "phone_number": payment.phone_number,
                "plan": payment.plan,
                "amount": payment.amount,
                "transaction_code": payment.transaction_code,
                "payment_date": payment.payment_date,
                "status": payment.status,
            }
        )

    return Response(
        {
            "count": len(payment_data),
            "payments": payment_data,
        },
        status=status.HTTP_200_OK
    )


# POST /api/admin/payments/<payment_id>/approve/
@api_view(["POST"])
@permission_classes([IsAdminUser])
def admin_approve_payment(request, payment_id):
    with transaction.atomic():
        payment = get_object_or_404(
            Payment.objects.select_for_update().select_related("enrolment"),
            id=payment_id,
        )

        if payment.status == "completed":
            return Response(
                {"message": "This payment has already been approved."},
                status=status.HTTP_200_OK,
            )

        if payment.status != "pending":
            return Response(
                {
                    "error": (
                        "Only pending payments can be approved."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment.status = "completed"
        payment.save(update_fields=["status", "updated_at"])

        enrolment = payment.enrolment
        enrolment.payment_status = "paid"

        if not enrolment.paid_at:
            enrolment.paid_at = timezone.now()

        enrolment.save(
            update_fields=[
                "payment_status",
                "paid_at",
                "updated_at",
            ]
        )

    return Response(
        {
            "message": "Payment approved successfully.",
            "payment": {
                "id": payment.id,
                "status": payment.status,
                "transaction_code": payment.transaction_code,
            },
            "enrolment": {
                "id": enrolment.id,
                "payment_status": enrolment.payment_status,
                "status": enrolment.status,
            },
        },
        status=status.HTTP_200_OK,
    )


# POST /api/admin/payments/<payment_id>/reject/
@api_view(["POST"])
@permission_classes([IsAdminUser])
def admin_reject_payment(request, payment_id):
    with transaction.atomic():
        payment = get_object_or_404(
            Payment.objects.select_for_update(),
            id=payment_id,
        )

        if payment.status != "pending":
            return Response(
                {
                    "error": (
                        "Only pending payments can be rejected."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment.status = "failed"
        payment.save(update_fields=["status", "updated_at"])

    return Response(
        {
            "message": "Payment rejected successfully.",
            "payment": {
                "id": payment.id,
                "status": payment.status,
                "transaction_code": payment.transaction_code,
            },
        },
        status=status.HTTP_200_OK,
    )

# GET /api/admin/reports/
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_reports(request):
    total_users = User.objects.count()

    total_providers = ProviderProfile.objects.count()

    total_enrolments = ProviderEnrolment.objects.count()

    approved_enrolments = ProviderEnrolment.objects.filter(
        status="approved"
    ).count()

    rejected_enrolments = ProviderEnrolment.objects.filter(
        status="rejected"
    ).count()

    pending_enrolments = ProviderEnrolment.objects.filter(
        status="submitted"
    ).count()

    total_service_requests = ServiceRequest.objects.count()

    total_payments = Payment.objects.count()

    completed_payments = Payment.objects.filter(
        status="completed"
    ).count()

    failed_payments = Payment.objects.filter(
        status="failed"
    ).count()

    total_revenue = Payment.objects.filter(
        status="completed"
    ).aggregate(
        total=Sum("amount")
    )["total"] or 0

    return Response(
        {
            "users": {
                "total": total_users,
            },
            "providers": {
                "total_profiles": total_providers,
                "total_enrolments": total_enrolments,
                "approved_enrolments": approved_enrolments,
                "pending_enrolments": pending_enrolments,
                "rejected_enrolments": rejected_enrolments,
            },
            "service_requests": {
                "total": total_service_requests,
            },
            "payments": {
                "total": total_payments,
                "completed": completed_payments,
                "failed": failed_payments,
                "total_revenue": total_revenue,
            },
        },
        status=status.HTTP_200_OK
    )



# GET /api/admin/dashboard/
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_dashboard(request):
    total_users = User.objects.count()

    total_customers = 0
    total_provider_accounts = 0

    # Account stores whether a user is a customer or provider.
    # This assumes the Account model has an account_type field.

   

    total_customers = Account.objects.filter(
        account_type="customer"
    ).count()

    total_provider_accounts = Account.objects.filter(
        account_type="provider"
    ).count()

    total_provider_profiles = ProviderProfile.objects.count()

    approved_providers = ProviderEnrolment.objects.filter(
        status="approved"
    ).count()

    pending_providers = ProviderEnrolment.objects.filter(
        status="submitted"
    ).count()

    total_requests = ServiceRequest.objects.count()

    total_payments = Payment.objects.count()

    completed_payments = Payment.objects.filter(
        status="completed"
    ).count()

    total_revenue = Payment.objects.filter(
        status="completed"
    ).aggregate(
        total=Sum("amount")
    )["total"] or 0

    return Response(
        {
            "users": {
                "total": total_users,
                "customers": total_customers,
                "provider_accounts": total_provider_accounts,
            },
            "providers": {
                "total_profiles": total_provider_profiles,
                "approved": approved_providers,
                "pending": pending_providers,
            },
            "service_requests": {
                "total": total_requests,
            },
            "payments": {
                "total": total_payments,
                "completed": completed_payments,
                "total_revenue": total_revenue,
            },
        },
        status=status.HTTP_200_OK
    )