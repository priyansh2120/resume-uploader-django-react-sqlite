# type: ignore
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from .models import Resume, User, Country, State, City, AccessToken
from .serializers import ResumeSerializer, UserSerializer, CountrySerializer, StateSerializer, CitySerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes
from rest_framework import status, generics
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from django.shortcuts import get_object_or_404  


@api_view(['GET', 'POST', 'PUT'])
@parser_classes([MultiPartParser, FormParser])
def resume_list_Api(request, id=0):
    def verify_token(request):
        try:
            jwt_token = request.headers['Authorization'].split(' ')[1]
            print(jwt_token)
            AccessToken.objects.get(access_token=jwt_token)
            return True
        except (KeyError, AccessToken.DoesNotExist):
            return False
    
    if request.method == 'GET':
        if verify_token(request):
            resumes = Resume.objects.all()
            serializer = ResumeSerializer(resumes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED)
    
    elif request.method == 'POST':
        if verify_token(request):
            user_id = request.data.get('userId')
            user = get_object_or_404(User, userId=user_id)
            request.data['userId'] = user.pk
            serializer = ResumeSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED)

    elif request.method == 'PUT':
        if verify_token(request):
            try:
                resume = Resume.objects.get(resumeId=request.data['resumeId'])
            except Resume.DoesNotExist:
                return Response({"error": "Resume not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = ResumeSerializer(resume, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED)

@csrf_exempt
def single_resume_Api(request, id):
    def verify_token(request):
        try:
            jwt_token = request.headers['Authorization'].split(' ')[1]
            print(jwt_token)
            AccessToken.objects.get(access_token=jwt_token)
            return True
        except (KeyError, AccessToken.DoesNotExist):
            return False
    
    if request.method == 'GET':
        if verify_token(request):
            try:
                resume = Resume.objects.get(resumeId=id)
            except Resume.DoesNotExist:
                return JsonResponse({"error": "Resume not found"}, status=404)
            serializer = ResumeSerializer(resume)
            return JsonResponse(serializer.data, safe=False)
        else:
            return Response({"error": "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED)
    elif request.method == 'DELETE':
        if verify_token(request):
            try:
                resume = Resume.objects.get(resumeId=id)
            except Resume.DoesNotExist:
                return JsonResponse({"error": "Resume not found"}, status=404)
            resume.delete()
            return JsonResponse({"message": "Resume deleted"}, status=204)
        else:
            return Response({"error": "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED)
    

    
class CountryList(generics.ListAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer

class StateList(generics.ListAPIView):
    serializer_class = StateSerializer

    def get_queryset(self):
        country_name = self.kwargs['country_name']
        return State.objects.filter(country__name=country_name)

class CityList(generics.ListAPIView):
    serializer_class = CitySerializer

    def get_queryset(self):
        state_name = self.kwargs['state_name']
        return City.objects.filter(state__name=state_name)
    
    
@api_view(['GET'])
def tech_knowledge_options(request):
    tech_knowledge_options = ['Java', 'Python', 'JavaScript', 'C#', 'C++', 'Ruby', 'PHP', 'Swift', 'Kotlin']
    return Response(tech_knowledge_options)

@api_view(['GET'])
def domain_knowledge_options(request):
    domain_knowledge_options = ['Cloud Computing', 'Web Development', 'Machine Learning', 'Data Science', 'Artificial Intelligence', 'Blockchain', 'Cybersecurity', 'Mobile Development', 'Networking']
    return Response(domain_knowledge_options)

@api_view(['GET'])
def keyword_options(request):
    keyword_options = ['Team player', 'Problem solver', 'Good communication skills', 'Leadership', 'Detail-oriented', 'Self-motivated', 'Adaptable', 'Organized', 'Creative', 'Analytical']
    return Response(keyword_options)
                       

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Resume, AccessToken

@api_view(['PUT'])
def toggle_approval(request, resume_id):
    
    def verify_token(request):
        try:
            jwt_token = request.headers['Authorization'].split(' ')[1]
            AccessToken.objects.get(access_token=jwt_token)
            return True
        except (KeyError, AccessToken.DoesNotExist):
            return False
    
    if verify_token(request):
        try:
            jwt_token = request.headers['Authorization'].split(' ')[1]
            access_token_obj = AccessToken.objects.get(access_token=jwt_token)
            user = access_token_obj.user
            if user.isAdmin:
                try:
                    resume = Resume.objects.get(resumeId=resume_id)
                except Resume.DoesNotExist:
                    return Response({"error": "Resume not found"}, status=status.HTTP_404_NOT_FOUND)

                resume.isApproved = not resume.isApproved
                resume.save()
                return Response({"message": "Approval status toggled successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "User is not authorized to perform this action"}, status=status.HTTP_403_FORBIDDEN)
        except KeyError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({"error": "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED)


@csrf_exempt
def user_signup_Api(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        existing_user = User.objects.filter(userId=data.get('userId')).exists()
        if existing_user:
            return JsonResponse({"error": "User already exists"}, status=400)
        
        if 'userId' not in data or 'password' not in data:
            return JsonResponse({"error": "User ID and password are required"}, status=400)
        
        if len(data['password']) < 8:
            return JsonResponse({"error": "Password must be at least 8 characters long"}, status=400)

        data['password'] = make_password(data['password'])


        data['created_at'] = timezone.now()
        data['modified_at'] = timezone.now()
        data['is_active'] = True  # Set user as active by default

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    
@csrf_exempt
def login_api(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        username = data.get('userId')
        password = data.get('password')

        # Find user by username
        try:
            user = User.objects.get(userId=username)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Invalid username or password'}, status=400)

        # Check if password matches
        if not check_password(password, user.password):
            return JsonResponse({'error': 'Invalid username or password'}, status=400)

        # Delete existing access token for the user, if any
        AccessToken.objects.filter(user=user).delete()

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Save access token to database
        access_token_obj = AccessToken.objects.create(user=user, access_token=access_token, refresh_token=refresh_token, created_at=timezone.now())

        # Check if user is admin
        is_admin = user.isAdmin

        # Return tokens to the client
        response_data = {
            'refresh': refresh_token,
            'access': access_token,
            'is_admin': is_admin
        }
        return JsonResponse(response_data)
    
@csrf_exempt
def check_admin(request):
    try:
        token = request.headers['Authorization'].split(' ')[1]
        access_token = AccessToken.objects.get(access_token=token)
        user = access_token.user
    except (KeyError, AccessToken.DoesNotExist):
        return JsonResponse({'error': 'User not found'}, status=404)
    
    return JsonResponse({'isAdmin': user.isAdmin})

@api_view(['POST'])
def logout_api(request):
    if request.method == 'POST':
        try:
            jwt_token = request.headers['Authorization'].split(' ')[1]
            access_token = AccessToken.objects.get(access_token=jwt_token)
            access_token.delete()
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({"error": "Token not found"}, status=status.HTTP_404_NOT_FOUND)