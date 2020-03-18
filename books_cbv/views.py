from django.http import HttpResponse
from django.views.generic import TemplateView,ListView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db.models import Q 

from books_cbv.models import SiteBookmark

# Template files 
tpl_main = "books_cbv/book_list.html"
tpl_forms = "books_cbv/form.html"

class BookmarkList(ListView):
    template_name = tpl_main
    model = SiteBookmark

    def get_queryset(self):
        query = self.request.GET.get('search')
        if query:
            return self.model.objects.filter( Q(name__contains = query) 
                                            | Q(url__contains = query) )
        
        #print(" [BookmarkList] kwargs = " + str(self.kwargs))
        return self.model.objects.all()


class BookmarkStarred(ListView):
    template_name = tpl_main
    # model = SiteBookmark

    def get_queryset(self):
        lst = SiteBookmark.objects.filter(starred = True)
        return lst 

class BookmarkCreate(CreateView):
    template_name = tpl_forms
    model = SiteBookmark
    fields = ['name', 'url', 'starred', 'brief', 'tags']
    success_url = reverse_lazy('books_cbv:bookmark_list')

class BookmarkUpdate(UpdateView):
    template_name = tpl_forms
    model = SiteBookmark
    fields = ['name', 'url', 'starred', 'brief', 'tags']
    success_url = reverse_lazy('books_cbv:bookmark_list')

class BookmarkDelete(DeleteView):
    template_name = "books_cbv/book_confirm_delete.html"
    model = SiteBookmark
    success_url = reverse_lazy('books_cbv:bookmark_list')