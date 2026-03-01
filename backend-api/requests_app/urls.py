from django.urls import path

from . import views

urlpatterns = [
    # lista materiais
    path("material-types/", views.MaterialTypeListView.as_view(), name="material_types_list"),

    # requests
    path("requests/", views.PickupRequestCreateView.as_view(), name="requests_create"),
    path("requests/my/", views.MyPickupRequestsView.as_view(), name="requests_my"),
    path("requests/center/", views.CenterPickupRequestsView.as_view(), name="requests_center"),
    path("requests/<int:pk>/status/", views.UpdatePickupRequestStatusView.as_view(), name="requests_status"),
]