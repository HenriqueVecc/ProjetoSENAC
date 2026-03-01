from django.conf import settings
from django.db import models

from centers.models import Center


class MaterialType(models.Model):
    name = models.CharField(max_length=80, unique=True)

    def __str__(self):
        return self.name


class PickupRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "PENDING"
        ACCEPTED = "ACCEPTED", "ACCEPTED"
        REJECTED = "REJECTED", "REJECTED"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="pickup_requests",
    )
    center = models.ForeignKey(
        Center,
        on_delete=models.CASCADE,
        related_name="pickup_requests",
    )

    material_type = models.ForeignKey(MaterialType, on_delete=models.PROTECT)
    estimated_quantity = models.PositiveIntegerField()
    address = models.CharField(max_length=255)
    pickup_date = models.DateField()

    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request #{self.id} - {self.status}"