from django.urls import include, path
from rest_framework import routers
from . views import (UserViewSet, BusinessGroupViewSet,
                     BusinessGroupAdminViewSet, BusinessGroupMappingViewSet, 
                     CustomerViewSet, AccountsViewSet,
                     TransactionViewSet, DenominationViewSet)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'business_group', BusinessGroupViewSet)
router.register(r'business_group_admin', BusinessGroupAdminViewSet)
router.register(r'business_group_mapping', BusinessGroupMappingViewSet)
router.register(r'customer', CustomerViewSet)
router.register(r'account', AccountsViewSet)
router.register(r'transaction', TransactionViewSet)
router.register(r'denomination', DenominationViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls))
]
