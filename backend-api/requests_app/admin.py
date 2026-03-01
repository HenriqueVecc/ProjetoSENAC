from django.contrib import admin
from .models import MaterialType, PickupRequest

admin.site.register(MaterialType)
admin.site.register(PickupRequest)