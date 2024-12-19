from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, ProductViewSet, LoginLogViewSet, CartViewSet, OrderViewSet

# Create a router and register the CustomerViewSet
router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'logs', LoginLogViewSet, basename='login-log')
router.register(r'carts', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Include router-generated URLs
]