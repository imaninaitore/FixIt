from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Account(models.Model):
    ACCOUNT_TYPES = (
        ("customer", "Customer"),
        ("provider", "provider"),
     )

    user = models.OneToOneField( User, on_delete=models.CASCADE)

    account_type = models.CharField( max_length=20,choices=ACCOUNT_TYPES )

    def __str__(self):
        return f"{self.user.username} - {self.account_type}"