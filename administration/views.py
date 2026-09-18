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
    profiles = ProviderProfile.objects.all().order_by("-id")

    profile_data = []

    for profile in profiles:
        profile_data.append(
            {
                "id": profile.id,
            }
        )

    return Response(
        {
            "count": len(profile_data),
            "provider_profiles": profile_data,
        },
        status=status.HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_enrolment_detail(request, enrolment_id):
    profile = get_object_or_404(
        ProviderProfile,
        id=enrolment_id
    )

    return Response(
        {
            "id": profile.id,
        },
        status=status.HTTP_200_OK
    )

@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def admin_approve_enrolment(request, enrolment_id):
    enrolment = get_object_or_404(
        ProviderEnrolment,
        id=enrolment_id
    )

    enrolment.status = "approved"
    enrolment.save()

    return Response(
        {
            "message": "Provider enrolment approved successfully.",
            "id": enrolment.id,
            "provider": enrolment.provider.username,
            "status": enrolment.status,
        },
        status=status.HTTP_200_OK
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