from django.db import models
from django.contrib.auth.models import User
import uuid
from django.utils.timezone import now

# Create your models here.


#product Model
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Customer(models.Model):
    username = models.CharField(max_length=150, unique=True, primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.username
   

class Log(models.Model):
    customer = models.ForeignKey(Customer,on_delete=models.CASCADE)
    time = models.DateField(auto_now=True)


class Cart(models.Model):
    customer = models.ForeignKey(Customer,on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    created_at = models.TimeField(auto_now=True)

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order for {self.customer.username} on {self.created_at}"

class OrderProduct(models.Model):
    order = models.ForeignKey(Order, related_name="order_products", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)  # Default quantity to 1

    def __str__(self):
        return f"{self.product.name} (x{self.quantity})"