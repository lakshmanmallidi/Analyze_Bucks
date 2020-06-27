from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from uuid import uuid4

# Create your models here.
class Partnership(models.Model):
    partnership_id = models.AutoField(primary_key=True)
    partnership_name = models.CharField(max_length=30,null=False)
    created_at = now

class PartnershipAdmin(models.Model):
    partnership = models.ForeignKey(Partnership,on_delete=models.CASCADE,null=False)
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=False)

class PartnershipMapping(models.Model):
    partnership = models.ForeignKey(Partnership,on_delete=models.CASCADE,null=False)
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=False)
    added_at = now

class Customer(models.Model):
    class OwnerType(models.TextChoices):
        User = "User"
        Partnership = "Partnership"
    
    cust_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30,null=False)
    address = models.CharField(max_length=100,null=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    partnership = models.ForeignKey(Partnership,on_delete=models.CASCADE,null=True)
    owner_type = models.CharField(max_length=11,choices=OwnerType.choices, null=False)
    ref_cust = models.ForeignKey("self",on_delete=models.SET_NULL,null=True)
    created_at = now

class Account(models.Model):
    class AccountType(models.TextChoices):
        Daily = "Daily"
        Weekly = "Weekly"
        Monthly = "Monthly"
        OneTime = "One_Time"
        Adjustment = "Adjustment"

    acct_id = models.AutoField(primary_key=True)
    cust = models.ForeignKey(Customer,on_delete=models.CASCADE,null=False)
    acct_type = models.CharField(max_length=10,choices=AccountType.choices, null=False)
    principle = models.DecimalField(max_digits=7,decimal_places=2,null=False)
    time = models.IntegerField(null=True)
    interest_inadvance = models.DecimalField(max_digits=5,decimal_places=2,null=True)
    created_at = now

    @property
    def get_installment(self):
        return self.principle/float(time)

class Transactions(models.Model):
    transaction_id = models.UUIDField(primary_key=True,default=uuid4,editable=False)
    transaction_date = models.DateTimeField(null=False)
    acct = models.ForeignKey(Account,on_delete=models.CASCADE,null=False)
    amount = models.DecimalField(max_digits=4,decimal_places=2,null=False)

class Denomination(models.Model):
    transactions = models.ForeignKey(Transactions,null=False,on_delete=models.CASCADE)
    value = models.IntegerField(null=False)
    count = models.IntegerField(default=1,null=False)  

