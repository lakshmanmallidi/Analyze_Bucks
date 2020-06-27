from django.urls import include, path
from rest_framework import routers
from . views import (UserViewSet,PartnershipViewSet,
    PartnershipAdminViewSet,PartnershipMappingViewSet,CustomerViewSet,AccountsViewSet,
    TransactionsViewSet,DenominationViewSet)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'partnership', PartnershipViewSet)
router.register(r'partnership_admin', PartnershipAdminViewSet)
router.register(r'partnership_mapping', PartnershipMappingViewSet)
router.register(r'customer', CustomerViewSet)
router.register(r'account', AccountsViewSet)
router.register(r'transaction', TransactionsViewSet)
router.register(r'denomination', DenominationViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls))
]
