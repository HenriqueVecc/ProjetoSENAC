from django.conf import settings
from django.db import models


class Profile(models.Model):
    class UserType(models.TextChoices):
        USER = "USER", "USER"
        CENTER = "CENTER", "CENTER"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    name = models.CharField(max_length=150)
    type = models.CharField(max_length=10, choices=UserType.choices, default=UserType.USER)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.type})"