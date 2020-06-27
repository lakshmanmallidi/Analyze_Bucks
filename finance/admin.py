from django.contrib import admin
from . models import (Account,Customer,Denomination,
Partnership,PartnershipAdmin,PartnershipMapping,Transactions)

# Register your models here.
admin.site.register(Account)
admin.site.register(Customer)
admin.site.register(Denomination)
admin.site.register(Partnership)
admin.site.register(PartnershipAdmin)
admin.site.register(PartnershipMapping)
admin.site.register(Transactions)