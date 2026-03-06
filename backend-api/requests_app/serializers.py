from rest_framework import serializers

from .models import MaterialType, PickupRequest


class MaterialTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialType
        fields = ["id", "name"]


class PickupRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupRequest
        fields = ["id", "center", "material_type", "estimated_quantity", "quantity_unit", "address", "pickup_date"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class PickupRequestListSerializer(serializers.ModelSerializer):
    center_name = serializers.CharField(source="center.name", read_only=True)
    material_name = serializers.CharField(source="material_type.name", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_name = serializers.SerializerMethodField()

    def get_user_name(self, obj):
        profile = getattr(obj.user, 'profile', None)
        return profile.name if profile else None

    class Meta:
        model = PickupRequest
        fields = [
            "id",
            "center",
            "center_name",
            "material_type",
            "material_name",
            "estimated_quantity",
            "quantity_unit",
            "address",
            "pickup_date",
            "status",
            "created_at",
            "user_email",
            "user_name",
        ]


class PickupRequestStatusSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=PickupRequest.Status.choices)

    class Meta:
        model = PickupRequest
        fields = ["status"]