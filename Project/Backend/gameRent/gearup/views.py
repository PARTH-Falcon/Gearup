from rest_framework.viewsets import ModelViewSet
from .models import Customer, Product, Log, Cart, Order
from .serializers import SignUpSerializer, ProductSerializer, LoginLogSerializer, CreateCart, OrderSerializer
from django_filters.rest_framework import DjangoFilterBackend


class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = SignUpSerializer

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class LoginLogViewSet(ModelViewSet):
    queryset = Log.objects.order_by('-id')[0:1]
    serializer_class = LoginLogSerializer

class CartViewSet(ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CreateCart
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['customer']


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['customer']

