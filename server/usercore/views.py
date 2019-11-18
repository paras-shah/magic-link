# from django.shortcuts import render
# from django.shortcuts import render
import smtplib
import configparser
from pathlib import Path
import datetime

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User

from rest_framework_jwt.settings import api_settings
# from sesame.utils import get_user, get_query_string
from .serializers import UserSerializer, UserSerializerWithToken
from django.conf import settings
#from rest_framework import serializers
from django.core import serializers


# Create your views here.

@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """    
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendMagicLink(APIView):
    """
    Send a magic link if user exist
    """
    permission_classes = (permissions.AllowAny,)

    def send_mail(self, token):
        config = configparser.ConfigParser()
        config_file = "example.ini"
        try:
            config.read(config_file)
        except:
            raise Exception("Failed reading {} file.".format(config_file))

        server_address = config.get("DEFAULT", "server")
        smtp_username = config.get("DEFAULT", "user_name")
        smtp_password = config.get("DEFAULT", "password")
        port = 587
        sender = config.get("DEFAULT", "sender")
        
        url_string = "http://localhost:3000/verifyAuth?token_url=" + token
        # encryption="STARTTLS"
       
        to_addr = "paras.shah@rubrik.com"
        date = datetime.datetime.now().strftime("%d/%m/%Y %H:%M")
        html = """\
<html>
  <head></head>
  <body>
    <p>Hi!<br>
       How are you?<br>
       Here is the link - <a href=""" + url_string  + """>Click here to Login </a>.
    </p>
  </body>
</html>
"""

        # Create message container - the correct MIME type is multipart/alternative.
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Login Email"
        msg['From'] = sender
        msg['To'] = to_addr
        msg['Date'] = date

        # Record the MIME types of both parts - text/plain and text/html.
        part = MIMEText(html, 'html')

        # Attach parts into message container.
        # According to RFC 2046, the last part of a multipart message, in this case
        # the HTML message, is best and preferred.
        msg.attach(part)

        try:
            server = smtplib.SMTP(server_address, port)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(smtp_username, smtp_password)
            response = server.sendmail(sender, to_addr,  msg.as_string())
            server.close()
            print("Successfully sent email", response)
        except Exception as error:
            print(str(error))
            print("Error: unable to send email")

            
    def post(self, request, format = None):
        """
        pass
        """
        email_id = request.data.pop('email', None)
        # user = User.objects.filter(email=email_id)
        user = User.objects.filter(username=email_id)
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(user[0])
        token = jwt_encode_handler(payload)

        #urlString = "http://localhost:3000/verifyAuth" + get_query_string(user[0])
        self.send_mail(token)
        return Response("Successfully sent email " + token)
       

class VerifyMagicLink(APIView):
    """
    Verify magic link if user exist
    """
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        
       # TOKEN_NAME = getattr(settings, "SESAME_TOKEN_NAME", "url_auth_token")
        #user = get_user(request)
        
        data = serializers.serialize('json', settings)
        return Response(data, content_type="application/json")

        