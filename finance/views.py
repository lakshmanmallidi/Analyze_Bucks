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
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = UserSerializer


class BusinessGroupViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = BusinessGroup.objects.all()
    serializer_class = BusinessGroupSerializer
    def list(self, request):
        current_user = request.user
        group_list = BusinessGroupMapping.objects \
            .filter(user=current_user).values_list("business_group",flat=True)
        respose = self.serializer_class(BusinessGroup \
            .objects.filter(group_id__in=group_list),many=True).data
        return Response(respose)

    def create(self, request):
        current_user = request.user
        business_group = self.serializer_class(data=request.data)
        if business_group.is_valid():
            saved_bg = business_group.save()
            mapping_data = {"business_group":saved_bg.group_id, "user":current_user.id}
            mapping_obj = BusinessGroupMappingSerializer(data=mapping_data)
            admin_obj = BusinessGroupAdminSerializer(data=mapping_data)
            if mapping_obj.is_valid() and admin_obj.is_valid():
                mapping_obj.save()
                admin_obj.save()
                return Response({"status":True})
            else:
                return Response(mapping_obj.errors.update(admin_obj.errors), \
                    status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(business_group.errors, status=status.HTTP_400_BAD_REQUEST)

class BusinessGroupAdminViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = BusinessGroupAdmin.objects.all()
    serializer_class = BusinessGroupAdminSerializer


class BusinessGroupMappingViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = BusinessGroupMapping.objects.all()
    serializer_class = BusinessGroupMappingSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class AccountsViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Account.objects.all()
    serializer_class = AccountSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class DenominationViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Denomination.objects.all()
    serializer_class = DenominationSerializer
