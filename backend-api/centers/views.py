from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Center
from .serializers import CenterSerializer
from .permissions import IsCenterUser


class CenterListCreateView(generics.ListCreateAPIView):
    queryset = Center.objects.all().order_by("-created_at")
    serializer_class = CenterSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsCenterUser()]
        return [AllowAny()]

    def perform_create(self, serializer):
        # impede criar 2 centers pro mesmo user
        if Center.objects.filter(user=self.request.user).exists():
            raise ValidationError({"detail": "Este usuário já possui um centro cadastrado."})
        serializer.save(user=self.request.user)


class CenterDetailView(generics.RetrieveAPIView):
    queryset = Center.objects.all()
    serializer_class = CenterSerializer
    permission_classes = [AllowAny]