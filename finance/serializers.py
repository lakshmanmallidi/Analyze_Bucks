from django.contrib.auth.models import User
from . models import (BusinessGroup, BusinessGroupAdmin,
                      BusinessGroupMapping, Customer, Account,
                      Transaction, Denomination)

from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        read_only_fields = ['id']

class BusinessGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessGroup
        fields = ['group_id', 'group_name', 'created_at', 'is_active']
        read_only_fields = ['group_id', 'created_at']

class BusinessGroupAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessGroupAdmin
        fields = ['id', 'business_group', 'user']
        read_only_fields = ['id']

class BusinessGroupMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessGroupMapping
        fields = ['id', 'business_group', 'user', 'added_at']
        read_only_fields = ['id', 'added_at']


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['cust_id', 'name', 'identifier', 'address', 'business_group', 'ref_cust', 'created_at', 'is_active']
        read_only_fields = ['created_at', 'cust_id']


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['acct_id', 'display_name', 'customer', 'acct_type', 'principle',
                  'time', 'interest_inadvance', 'created_at', 'is_active']
        read_only_fields = ['created_at']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['transaction_id', 'transaction_date', 'account', 'amount']
        read_only_fields = ['transaction_id']


class DenominationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Denomination
        fields = ['transaction', 'value', 'count']
