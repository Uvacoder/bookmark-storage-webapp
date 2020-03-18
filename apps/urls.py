from django.urls import include, path
from django.contrib import admin

# from theme import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # Home or http:<site_addr>/
    path('', include('bookmarks.urls', namespace='bookmarks')),
]
