from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Sum
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from . models import (BusinessGroup, BusinessGroupAdmin,
                      BusinessGroupMapping, Customer, Account,
                      Transaction, Denomination)
from . serializers import (UserSerializer, BusinessGroupSerializer,
                           BusinessGroupAdminSerializer, BusinessGroupMappingSerializer,
                           CustomerSerializer, AccountSerializer, TransactionSerializer,
                           DenominationSerializer)

# Create your views here.


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def BusinessGroupView(request, group_id=None):
    current_user = request.user

    def view():
        group_list = BusinessGroupMapping.objects \
            .filter(user=current_user).values_list("business_group", flat=True)
        respose = BusinessGroupSerializer(BusinessGroup
                                          .objects.filter(group_id__in=group_list), many=True).data
        return Response(respose)

    def update():
        group_list = BusinessGroupAdmin.objects \
            .filter(user=current_user).values_list("business_group", flat=True)
        if group_id in group_list:
            if request.data['operation'] == "CLOSE":
                BusinessGroup.objects.filter(
                    group_id=group_id).update(is_active=False)
            elif request.data['operation'] == "ACTIVE":
                BusinessGroup.objects.filter(
                    group_id=group_id).update(is_active=True)
            return Response(BusinessGroupSerializer(BusinessGroup
                                                    .objects.get(group_id=group_id)).data)
        else:
            return Response({"status": "Authorization Error"},
                            status=status.HTTP_401_UNAUTHORIZED)

    def create():
        business_group = BusinessGroupSerializer(data=request.data)
        if business_group.is_valid():
            saved_bg = business_group.save()
            mapping_data = {"business_group": saved_bg.group_id,
                            "user": current_user.id}
            mapping_obj = BusinessGroupMappingSerializer(data=mapping_data)
            admin_obj = BusinessGroupAdminSerializer(data=mapping_data)
            if mapping_obj.is_valid() and admin_obj.is_valid():
                mapping_obj.save()
                admin_obj.save()
                return Response(BusinessGroupSerializer(saved_bg).data)
            else:
                return Response(mapping_obj.errors.update(admin_obj.errors),
                                status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(business_group.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete():
        group_list = BusinessGroupAdmin.objects \
            .filter(user=current_user).values_list("business_group", flat=True)
        if group_id in group_list:
            BusinessGroup.objects.filter(group_id=group_id).delete()
            return Response({"status": "success"})
        else:
            return Response({"status": "Authorization Error"},
                            status=status.HTTP_401_UNAUTHORIZED)

    if request.method == "GET":
        return view()
    elif request.method == "POST":
        return create()
    elif request.method == "PUT":
        return update()
    else:
        return delete()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetCustomersList(request, group_id):
    current_user = request.user
    group_list = BusinessGroupMapping.objects \
        .filter(user=current_user).values_list("business_group", flat=True)
    if group_id in group_list:
        respose = CustomerSerializer(Customer
                                     .objects.filter(business_group=group_id), many=True).data
        return Response(respose)
    else:
        return Response({"status": "Authorization Error"},
                        status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
def CustomerView(request, cust_id=None):
    current_user = request.user
    group_list = BusinessGroupAdmin.objects \
        .filter(user=current_user).values_list("business_group", flat=True)

    def update():
        try:
            group_id = int(request.data['business_group'])
            if group_id in group_list:
                if request.data['operation'] == "CLOSE":
                    Customer.objects.filter(business_group=group_id).filter(cust_id=cust_id) \
                        .update(is_active=False)
                elif request.data['operation'] == "ACTIVE":
                    Customer.objects.filter(business_group=group_id).filter(cust_id=cust_id) \
                        .update(is_active=True)
                return Response(CustomerSerializer(Customer.objects.get(cust_id=cust_id)).data)
            else:
                return Response({"status": "Authorization Error"},
                                status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"status": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)

    def create():
        try:
            group_id = int(request.data['business_group'])
            if group_id in group_list:
                customer = CustomerSerializer(data=request.data)
                if customer.is_valid():
                    saved_customer = customer.save()
                    return Response(CustomerSerializer(saved_customer).data)
                else:
                    return Response(customer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"status": "Authorization Error"},
                                status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"status": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "POST":
        return create()
    else:
        return update()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetAccountsList(request, group_id, cust_id):
    current_user = request.user
    group_list = BusinessGroupMapping.objects \
        .filter(user=current_user).values_list("business_group", flat=True)
    customer_list = Customer.objects \
        .filter(business_group=group_id).values_list("cust_id", flat=True)
    if (group_id in group_list) and (cust_id in customer_list):
        accounts = AccountSerializer(
            Account.objects.filter(customer=cust_id), many=True).data
        new_accounts = []
        for account in accounts:
            account['sum'] = Transaction \
                .objects.filter(account=account['acct_id']).aggregate(Sum('amount'))['amount__sum']
            new_accounts.append(account)
        return Response(new_accounts)
    else:
        return Response({"status": "Authorization Error"},
                        status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
def AccountsView(request, acct_id=None):
    current_user = request.user
    group_list = BusinessGroupAdmin.objects \
        .filter(user=current_user).values_list("business_group", flat=True)
    customer_list = Customer.objects \
        .filter(business_group=request.data['business_group']).values_list("cust_id", flat=True)

    def update():
        try:
            group_id = int(request.data['business_group'])
            cust_id = int(request.data["customer"])
            print(group_id, cust_id)
            if (group_id in group_list) and (cust_id in customer_list):
                if request.data['operation'] == "CLOSE":
                    Account.objects.filter(customer=cust_id).filter(acct_id=acct_id) \
                        .update(is_active=False)
                elif request.data['operation'] == "ACTIVE":
                    Account.objects.filter(customer=cust_id).filter(acct_id=acct_id) \
                        .update(is_active=True)
                return Response(AccountSerializer(Account.objects.get(acct_id=acct_id)).data)
            else:
                return Response({"status": "Authorization Error"},
                                status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(e)
            return Response({"status": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)

    def create():
        try:
            group_id = int(request.data['business_group'])
            cust_id = int(request.data["acct_data"]["customer"])
            if (group_id in group_list) and (cust_id in customer_list):
                account = AccountSerializer(data=request.data["acct_data"])
                if account.is_valid():
                    saved_account = account.save()
                    return Response(AccountSerializer(saved_account).data)
                else:
                    print(account.errors)
                    return Response(account.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"status": "Authorization Error"},
                                status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"status": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "POST":
        return create()
    else:
        return update()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetTransactionsList(request, group_id, cust_id, acct_id):
    current_user = request.user
    group_list = BusinessGroupMapping.objects \
        .filter(user=current_user).values_list("business_group", flat=True)
    customer_list = Customer.objects \
        .filter(business_group=group_id).values_list("cust_id", flat=True)
    account_list = Account.objects \
        .filter(customer=cust_id).values_list("acct_id", flat=True)

    if (group_id in group_list) and (cust_id in customer_list) and (acct_id in account_list):
        transactions = TransactionSerializer(
            Transaction.objects.filter(account=acct_id), many=True).data
        return Response(transactions)
    else:
        return Response({"status": "Authorization Error"},
                        status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def TransactionsView(request):
    current_user = request.user
    group_list = BusinessGroupAdmin.objects \
        .filter(user=current_user).values_list("business_group", flat=True)
    customer_list = Customer.objects \
        .filter(business_group=request.data['business_group']).values_list("cust_id", flat=True)
    account_list = Account.objects \
        .filter(customer=request.data['customer']).values_list("acct_id", flat=True)
    try:
        group_id = int(request.data['business_group'])
        cust_id = int(request.data["customer"])
        acct_id = int(request.data["transaction_data"]["account"])
        if (group_id in group_list) and (cust_id in customer_list) and (acct_id in account_list):
            transaction = TransactionSerializer(data=request.data["transaction_data"])
            if transaction.is_valid():
                saved_transaction = transaction.save()
                return Response(TransactionSerializer(saved_transaction).data)
            else:
                return Response(transaction.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"status": "Authorization Error"},
                            status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({"status": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)
