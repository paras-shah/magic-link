# magic-link
Using Python JWT to use magic links



"prop-types": "^15.7.2",
"query-string": "^6.9.0",

>>>
## Server side installation 
>>  python --version
>> install homebrew - depends on xcode
>> xcode-select --install
>> /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
>> brew doctor
>> python3 --version

### User virtual env 
### venv is  default but we will use pipeenv so run
brew install pipenv

### Goto virtual env
pipeenv shell 
### install 
pipenv install django==2.2.6
pipenv install djangorestframework
pipenv install djangorestframework-jwt
pipenv install django-cors-headers

### Creating the project 
django-admin startproject jwtmagicsite .
### edit settings 
'rest_framework'
'corsheaders',
 'corsheaders.middleware.CorsMiddleware', # Note that this needs to be placed above CommonMiddleware  
REST_FRAMEWORK
CORS_ORIGIN_WHITELIST

### do migrations
python manage.py migrate
python manage.py createsuperuser
### taking username as email
python manage.py runserver 127.0.0.1:8100

### create an app - usercore
python manage.py startapp usercore
### update settings 

### create serializers.py in app
### create views.py  in app
### create urls.py  in app

### crearted example.ini

pipenv install configparser


