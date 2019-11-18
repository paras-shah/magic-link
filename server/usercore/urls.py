from django.urls import path
from .views import current_user, UserList, SendMagicLink, VerifyMagicLink

urlpatterns = [
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
    path('magic-link-auth/', SendMagicLink.as_view()),
    path('magic-link-auth-signup/', VerifyMagicLink.as_view()),    
]
