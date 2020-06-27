from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets
from . models import (Partnership, PartnershipAdmin, 
    PartnershipMapping, Customer, Account, 
    Transactions,Denomination)
from . serializers import (UserSerializer, PartnershipSerializer,
    PartnershipAdminSerializer,PartnershipMappingSerializer,
    CustomerSerializer,AccountSerializer,TransactionsSerializer,
    DenominationSerializer)
# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PartnershipViewSet(viewsets.ModelViewSet):
    queryset = Partnership.objects.all()
    serializer_class = PartnershipSerializer

class PartnershipAdminViewSet(viewsets.ModelViewSet):
    queryset = PartnershipAdmin.objects.all()
    serializer_class = PartnershipAdminSerializer

class PartnershipMappingViewSet(viewsets.ModelViewSet):
    queryset = PartnershipMapping.objects.all()
    serializer_class = PartnershipMappingSerializer
    
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class AccountsViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class TransactionsViewSet(viewsets.ModelViewSet):
    queryset = Transactions.objects.all()
    serializer_class = TransactionsSerializer

class DenominationViewSet(viewsets.ModelViewSet):
    queryset = Denomination.objects.all()
    serializer_class = DenominationSerializer