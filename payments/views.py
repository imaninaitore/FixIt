from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status


@api_view(["GET"])
def payment_information(request):
    return Response(
        {
            "message": "Providers submit payment details together with their enrolment application.",
            "payment_method": "Manual M-Pesa",
            "instructions": "Pay the required subscription amount to this number:0713819406 and enter the transaction code in the enrolment form."
        },
        status=status.HTTP_200_OK
    )