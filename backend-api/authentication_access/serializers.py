from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Profile
from centers.models import Center

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    type = serializers.ChoiceField(choices=Profile.UserType.choices)
    
    center_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    center_address = serializers.CharField(max_length=255, required=False, allow_blank=True)
    center_phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    center_description = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        email = value.lower().strip()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email já cadastrado.")
        return email

    def validate(self, attrs):
        if attrs.get('type') == Profile.UserType.CENTER:
            if not attrs.get('center_name'):
                raise serializers.ValidationError({"center_name": "Nome do centro é obrigatório para empresas."})
            if not attrs.get('center_address'):
                raise serializers.ValidationError({"center_address": "Endereço do centro é obrigatório para empresas."})
            if not attrs.get('center_phone'):
                raise serializers.ValidationError({"center_phone": "Telefone do centro é obrigatório para empresas."})
        return attrs

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]
        user_type = validated_data["type"]

        user = User.objects.create(username=email, email=email)
        user.set_password(password)
        user.save()

        profile = Profile.objects.create(
            user=user,
            name=validated_data["name"],
            type=user_type,
        )
        
        if user_type == Profile.UserType.CENTER:
            Center.objects.create(
                user=user,
                name=validated_data.get("center_name", validated_data["name"]),
                address=validated_data.get("center_address", ""),
                phone=validated_data.get("center_phone", ""),
                description=validated_data.get("center_description", ""),
            )
        
        return user
    
    def to_representation(self, instance):

        profile = getattr(instance, "profile", None)
        return {
            "id": instance.id,
            "email": instance.email,
            "name": profile.name if profile else None,
            "type": profile.type if profile else None,
        }
