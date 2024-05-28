
# type: ignore
from django.urls import path
from resumes import views
from django.conf import settings
from django.conf.urls.static import static
from .views import CountryList, StateList, CityList, tech_knowledge_options, domain_knowledge_options, keyword_options, toggle_approval, user_signup_Api, login_api, logout_api, check_admin

urlpatterns = [
    path('resume/', views.resume_list_Api),
    path('resume/<int:id>/', views.resume_list_Api),
    path('resume/view/<str:id>/', views.single_resume_Api),
    path('countries/', CountryList.as_view(), name='country-list'),
    path('countries/<str:country_name>/states/', StateList.as_view(), name='state-list'),
    path('states/<str:state_name>/cities/', CityList.as_view(), name='city-list'),
    path('tech-knowledge-options/', tech_knowledge_options, name='tech_knowledge_options'),
    path('domain-knowledge-options/', domain_knowledge_options, name='domain_knowledge_options'),
    path('keyword-options/', keyword_options, name='key_words_options'),
    path('resume/<str:resume_id>/toggle-approval', toggle_approval, name='toggle_approval'),
    path('user/signup/', user_signup_Api, name='user_signup_Api'),
    path('user/login/', login_api, name='login_api'),   
    path('user/logout/', logout_api, name='logout_api'),
    path('user/check-admin/', check_admin, name='check_admin'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    
    # api ki list bana 