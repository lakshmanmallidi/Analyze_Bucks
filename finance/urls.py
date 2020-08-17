from django.urls import include, path
from . views import (BusinessGroupView, GetCustomersList, CustomerView,
                     GetAccountsList, AccountsView, GetTransactionsList, TransactionsView)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('business_group/', BusinessGroupView),
    path('business_group/<int:group_id>/', BusinessGroupView),
    path('get_customers_list/<int:group_id>/', GetCustomersList),
    path('customer/', CustomerView),
    path('customer/<int:cust_id>/', CustomerView),
    path('get_accounts_list/<int:group_id>/<int:cust_id>/', GetAccountsList),
    path('account/', AccountsView),
    path('account/<int:acct_id>/', AccountsView),
    path('get_transactions_list/<int:group_id>/<int:cust_id>/<int:acct_id>/',
         GetTransactionsList),
    path('transaction/', TransactionsView)
]
