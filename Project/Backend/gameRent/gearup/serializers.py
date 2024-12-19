from rest_framework import serializers
from .models import Customer, Product, Log, Cart, Order, OrderProduct

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['username','email','password']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id','name','description','price_per_day','stock']

class LoginLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = ['id', 'time', 'customer']

class CreateCart(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['id','customer','product',]


class OrderProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')
    price_per_day = serializers.DecimalField(source='product.price_per_day', max_digits=10, decimal_places=2)

    class Meta:
        model = OrderProduct
        fields = ['id','product', 'product_name', 'price_per_day', 'quantity']

# Serializer for Order
class OrderSerializer(serializers.ModelSerializer):
    order_products = OrderProductSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id','customer', 'order_products', 'total_price']

    def create(self, validated_data):
        # Extract product list from the request
        product_ids = self.initial_data.get('products')
        customer = validated_data.get('customer')

        # Create the order
        order = Order.objects.create(customer=customer)

        # Create order products with default quantity as 1
        for product_id in product_ids:
            product = Product.objects.get(id=product_id)
            OrderProduct.objects.create(order=order, product=product, quantity=1)

        return order

    def get_total_price(self, obj):
        total_price = sum(order_product.product.price_per_day * order_product.quantity for order_product in obj.order_products.all())
        return total_price