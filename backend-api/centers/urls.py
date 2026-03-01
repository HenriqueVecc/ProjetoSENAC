from django.urls import path
from .views import CenterListCreateView, CenterDetailView

urlpatterns = [
    path("centers/", CenterListCreateView.as_view(), name="centers_list_create"),
    path("centers/<int:pk>/", CenterDetailView.as_view(), name="centers_detail"),
]