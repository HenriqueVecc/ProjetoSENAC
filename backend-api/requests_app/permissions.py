from rest_framework.permissions import BasePermission
from authentication_access.models import Profile


class IsNormalUser(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        profile = getattr(request.user, "profile", None)
        return bool(profile and profile.type == Profile.UserType.USER)


class IsCenterUser(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        profile = getattr(request.user, "profile", None)
        return bool(profile and profile.type == Profile.UserType.CENTER)