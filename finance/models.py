from django.db import models
from django.contrib.auth.models import User
from datetime import now
from enum import Enum
from uuid import uuid4

# Create your models here.
class Group(models.Model):
    group_id = models.AutoField(primary_key=True)
    group_name = models.CharField(max_length=30,null=False)
    created_at = models.DateTimeField(default=now, null=False)

class GroupAdmin(models.Model):
    group_id = models.ForeignKey(Group.group_id,on_delete=models.CASCADE)
    cust_id = models.ForeignKey(User.pk,on_delete=models.CASCADE)

class GroupMapping(models.Model):
    group_id = models.ForeignKey(Group.group_id,on_delete=models.CASCADE)
    cust_id = models.ForeignKey(User.pk,on_delete=models.CASCADE)
    added_at = models.DateTimeField(default=now, null=False)

class OwnerType(Enum):
    U = "User"
    G = "Group"

class Customer(models.Model):
    cust_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30,null=False)
    address = models.CharField(max_length=100)
    user_id = models.ForeignKey(User.pk,on_delete=models.CASCADE)
    group_id = models.ForeignKey(User.pk,on_delete=models.CASCADE)
    owner_type = models.Choices(OwnerType,null=False)
    ref_cust_id = models.ForeignKey(Customer.cust_id,on_delete=models.SET_NULL)
    created_at = models.DateTimeField(default=now, null=False)

class AccountType(Enum):
    DA = "Daily"
    WE = "Weekly"
    MO = "Monthly"
    OT = "One_Time"
    AJ = "Adjustment"

class Account(models.Model):
    acct_id = models.AutoField(primary_key=True)
    cust_id = models.ForeignKey(Customer.cust_id,on_delete=models.CASCADE,null=False)
    acct_type = models.Choices(AccountType,null=False)
    principle = models.DecimalField(null=False)
    time = models.IntegerField()
    interest_inadvance = models.DecimalField()
    created_at = models.DateTimeField(default=now, null=False)

    @property
    def get_installment(self):
        return self.principle/float(time)

class Transactions(models.Model):
    transaction_id = models.UUIDField(primary_key=True,default=uuid4,editable=False)
    transaction_date = models.DateTimeField(default=now(),null=False)
    acct_id = models.ForeignKey(Account.acct_id,on_delete=models.CASCADE,null=False)
    amount = models.DecimalField(null=False)

class Denomination(models.Model):
    transactions_id = models.ForeignKey(Transactions.transaction_id,null=False)
    value = models.DecimalField(null=False)
    count = models.IntegerField(default=1,null=False)  

