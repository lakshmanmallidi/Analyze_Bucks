import os
from django.http import HttpResponse
from django.views.generic import View
from django.conf import settings


class FrontendAppView(View):
    def get(self, request):
        try:
            with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse("", status=501)
