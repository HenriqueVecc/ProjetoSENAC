from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import MaterialType, PickupRequest
from .serializers import (
    MaterialTypeSerializer,
    PickupRequestCreateSerializer,
    PickupRequestListSerializer,
    PickupRequestStatusSerializer,
)
from .permissions import IsNormalUser, IsCenterUser


# listar materiais para o front montar dropdown
class MaterialTypeListView(generics.ListAPIView):
    queryset = MaterialType.objects.all().order_by("name")
    serializer_class = MaterialTypeSerializer


# POST /requests/ (USER)
class PickupRequestCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsNormalUser]
    serializer_class = PickupRequestCreateSerializer


# GET /requests/my (USER)
class MyPickupRequestsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsNormalUser]
    serializer_class = PickupRequestListSerializer

    def get_queryset(self):
        return PickupRequest.objects.filter(user=self.request.user).order_by("-created_at")


# GET /requests/center (CENTER)
class CenterPickupRequestsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsCenterUser]
    serializer_class = PickupRequestListSerializer

    def get_queryset(self):
        return PickupRequest.objects.filter(center__user=self.request.user).order_by("-created_at")


# PATCH /requests/:id/status (CENTER)
class UpdatePickupRequestStatusView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsCenterUser]
    serializer_class = PickupRequestStatusSerializer
    queryset = PickupRequest.objects.all()

    def update(self, request, *args, **kwargs):
        obj = self.get_object()

        # garante que só o dono do center pode mudar o status
        if obj.center.user_id != request.user.id:
            return Response(
                {"detail": "Você não pode alterar solicitações de outro centro."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().update(request, *args, **kwargs)