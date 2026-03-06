from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "id": user.id,
                "email": user.email,
                "message": "Usuário registrado com sucesso."
            },
            status=status.HTTP_201_CREATED
        )


class MeView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        profile = getattr(request.user, "profile", None)
        return Response({
            "id": request.user.id,
            "email": request.user.email,
            "name": profile.name if profile else None,
            "type": profile.type if profile else None,
        })