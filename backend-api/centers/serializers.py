from rest_framework import serializers
from .models import Center


class CenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Center
        fields = ["id", "user", "name", "address", "phone", "description", "created_at"]
        read_only_fields = ["id", "user", "created_at"]