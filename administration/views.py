from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status


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