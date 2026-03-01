from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Profile

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    type = serializers.ChoiceField(choices=Profile.UserType.choices)

    def validate_email(self, value):
        email = value.lower().strip()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email já cadastrado.")
        return email

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]

        # Usando User padrão: username = email
        user = User.objects.create(username=email, email=email)
        user.set_password(password)
        user.save()

        Profile.objects.create(
            user=user,
            name=validated_data["name"],
            type=validated_data["type"],
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
