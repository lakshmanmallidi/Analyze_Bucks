from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from uuid import uuid4

# Create your models here.


class BusinessGroup(models.Model):
    group_id = models.AutoField(primary_key=True)
    group_name = models.CharField(max_length=30, null=False)
    created_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

class BusinessGroupAdmin(models.Model):
    business_group = models.ForeignKey(
        BusinessGroup, on_delete=models.CASCADE, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)


class BusinessGroupMapping(models.Model):
    business_group = models.ForeignKey(
        BusinessGroup, on_delete=models.CASCADE, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    added_at = models.DateTimeField(auto_now=True)


class Customer(models.Model):
    cust_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30, null=False)
    identifier = models.CharField(max_length=30, null=False)
    address = models.CharField(max_length=100, null=True)
    business_group = models.ForeignKey(
        BusinessGroup, on_delete=models.CASCADE, null=False)
    ref_cust = models.ForeignKey("self", on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    class Meta:
        unique_together = ('name', 'identifier',)

class Account(models.Model):
    class AccountType(models.TextChoices):
        Daily = "Daily"
        Weekly = "Weekly"
        Monthly = "Monthly"
        OneTime = "One_Time"
        Adjustment = "Adjustment"

    acct_id = models.AutoField(primary_key=True)
    display_name = models.CharField(max_length=30, null=False)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
    acct_type = models.CharField(
        max_length=10, choices=AccountType.choices, null=False)
    principle = models.DecimalField(max_digits=7, decimal_places=2, null=False)
    time = models.IntegerField(null=True)
    interest_inadvance = models.DecimalField(
        max_digits=5, decimal_places=2, null=False)
    created_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    @property
    def get_installment(self):
        return self.principle/float(self.time)


class Transaction(models.Model):
    transaction_id = models.UUIDField(
        primary_key=True, default=uuid4, editable=False)
    transaction_date = models.DateTimeField(null=False)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, null=False)
    amount = models.DecimalField(max_digits=4, decimal_places=2, null=False)

class Denomination(models.Model):
    transaction = models.ForeignKey(
        Transaction, null=False, on_delete=models.CASCADE)
    value = models.IntegerField(null=False)
    count = models.IntegerField(default=1, null=False)
