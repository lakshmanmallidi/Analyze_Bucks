from django.contrib.auth.models import User
from . models import (Partnership, PartnershipAdmin, 
    PartnershipMapping, Customer, Account, 
    Transactions,Denomination)

from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email']

class PartnershipSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Partnership
        fields = ['partnership_id','partnership_name','created_at']
        read_only_fields = ['partnership_id','created_at']

class PartnershipAdminSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PartnershipAdmin
        fields = ['url','partnership','user']

class PartnershipMappingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PartnershipMapping
        fields = ['partnership','user','added_at']
        read_only_fields = ['added_at']

class CustomerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Customer
        fields = ['cust_id','name','address','user', \
            'partnership','owner_type','ref_cust','created_at']
        read_only_fields=['created_at','cust_id']

class AccountSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Account
        fields = ['acct_id','cust','acct_type','principle', \
            'time','interest_inadvance','created_at']
        read_only_fields=['created_at','acct_id']

class TransactionsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Transactions
        fields = ['transaction_id','transaction_date','acct','amount']
        read_only_fields=['transaction_id']

class DenominationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Denomination
        fields = ['transactions','value','count']