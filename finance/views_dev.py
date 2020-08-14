from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from . models import (BusinessGroup, BusinessGroupAdmin,
                      BusinessGroupMapping, Customer, Account,
                      Transaction, Denomination)
from . serializers import (UserSerializer, BusinessGroupSerializer,
                           BusinessGroupAdminSerializer, BusinessGroupMappingSerializer,
                           CustomerSerializer, AccountSerializer, TransactionSerializer,
                           DenominationSerializer)

# Create your views here.


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class BusinessGroupViewSet(viewsets.ModelViewSet):
    queryset = BusinessGroup.objects.all()
    serializer_class = BusinessGroupSerializer

class BusinessGroupAdminViewSet(viewsets.ModelViewSet):
    queryset = BusinessGroupAdmin.objects.all()
    serializer_class = BusinessGroupAdminSerializer


class BusinessGroupMappingViewSet(viewsets.ModelViewSet):
    queryset = BusinessGroupMapping.objects.all()
    serializer_class = BusinessGroupMappingSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class AccountsViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class DenominationViewSet(viewsets.ModelViewSet):
    queryset = Denomination.objects.all()
    serializer_class = DenominationSerializer