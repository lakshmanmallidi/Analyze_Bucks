from django.contrib import admin
from . models import (Account, Customer, Denomination,
                      BusinessGroup, BusinessGroupAdmin, BusinessGroupMapping, 
                      Transaction)

# Register your models here.
admin.site.register(Account)
admin.site.register(Customer)
admin.site.register(Denomination)
admin.site.register(BusinessGroup)
admin.site.register(BusinessGroupAdmin)
admin.site.register(BusinessGroupMapping)
admin.site.register(Transaction)
