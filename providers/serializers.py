import os
import re

from rest_framework import serializers

from .models import ProviderEnrolment, ProviderProfile


# Validate and normalize Kenyan phone numbers.
# Accepted examples:
# 0712345678 -> +254712345678
# 0112345678 -> +254112345678
# 254712345678 -> +254712345678
# +254712345678 -> +254712345678
def normalize_kenyan_phone(value):
    if not value:
        raise serializers.ValidationError(
            "A Kenyan phone number is required."
        )

    # Allow common formatting characters in phone numbers.
    phone = re.sub(r"[\s\-()]", "", str(value))

    if phone.startswith("0"):
        if len(phone) != 10:
            raise serializers.ValidationError(
                "Enter a valid Kenyan phone number, "
                "such as 0712345678 or 0112345678."
            )

        phone = "+254" + phone[1:]

    elif phone.startswith("254"):
        phone = "+" + phone

    elif not phone.startswith("+254"):
        raise serializers.ValidationError(
            "Use a Kenyan phone number starting with 07, 01, "
            "254, or +254."
        )

    # Kenyan mobile numbers use 7xx or 1xx prefixes.
    if not re.fullmatch(r"\+254[17]\d{8}", phone):
        raise serializers.ValidationError(
            "Enter a valid Kenyan mobile number, "
            "such as 0712345678 or +254712345678."
        )

    return phone


# Validate qualification documents.
# Accepted formats: PDF, JPG, JPEG and PNG.
# Maximum file size: 5 MB.
def validate_qualification_document(document):
    if not document:
        raise serializers.ValidationError(
            "Please upload your professional qualification document."
        )

    allowed_extensions = {".pdf", ".jpg", ".jpeg", ".png"}
    extension = os.path.splitext(document.name)[1].lower()

    if extension not in allowed_extensions:
        raise serializers.ValidationError(
            "Upload a PDF, JPG, JPEG, or PNG document."
        )

    max_size = 5 * 1024 * 1024

    if document.size > max_size:
        raise serializers.ValidationError(
            "The qualification document must not exceed 5 MB."
        )

    return document


class ProviderEnrolmentSerializer(serializers.ModelSerializer):
    # Return the stored file name rather than a direct file URL.
    qualification_document = serializers.FileField(
        use_url=False,
        required=False
    )

    class Meta:
        model = ProviderEnrolment

        fields = [
            "id",
            "provider",
            "business_name",
            "service_category",
            "description",
            "location",
            "years_of_experience",
            "phone_number",
            "referee_name",
            "referee_email",
            "referee_phone",
            "qualification_document",
            "status",
            "payment_status",
            "payment_reference",
            "paid_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "provider",
            "status",
            "payment_status",
            "paid_at",
            "created_at",
            "updated_at",
        ]

    def validate_phone_number(self, value):
        return normalize_kenyan_phone(value)

    def validate_referee_phone(self, value):
        return normalize_kenyan_phone(value)

    def validate_qualification_document(self, value):
        return validate_qualification_document(value)


class ProviderEnrolmentSubmissionSerializer(serializers.Serializer):
    # Business and service details
    business_name = serializers.CharField(max_length=255)
    service_category = serializers.CharField(max_length=100)
    description = serializers.CharField()
    location = serializers.CharField(max_length=255)

    years_of_experience = serializers.IntegerField(min_value=0)

    # Provider contact details
    phone_number = serializers.CharField(max_length=20)

    # Referee details
    referee_name = serializers.CharField(max_length=150)
    referee_email = serializers.EmailField()
    referee_phone = serializers.CharField(max_length=20)

    # Professional qualification document
    qualification_document = serializers.FileField(
        validators=[validate_qualification_document]
    )

    # Existing payment fields
    plan = serializers.ChoiceField(
        choices=[
            (
                "provider_subscription",
                "Provider Subscription"
            )
        ]
    )

    amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    transaction_code = serializers.CharField(max_length=100)
    payment_date = serializers.DateField()

    def validate_phone_number(self, value):
        return normalize_kenyan_phone(value)

    def validate_referee_phone(self, value):
        return normalize_kenyan_phone(value)


class ProviderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderProfile

        fields = [
            "id",
            "user",
            "business_name",
            "service_category",
            "description",
            "location",
            "years_of_experience",
            "phone_number",
            "profile_image",
            "is_available",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]

    def validate_phone_number(self, value):
        # Existing profiles may have an empty phone number.
        if not value:
            return value

        return normalize_kenyan_phone(value)
