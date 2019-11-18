from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Other than sign up 
    """
    class Meta:
        model = User
        fields = ('username',)

class UserSerializerWithToken(serializers.ModelSerializer):
    """
    To handle signups by sending additional token 
    token is the custom field -  
    """
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        """
        Manual creation of new token
        obj is user
        """
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token
    
    def create(self, validated_data):
        """
         to make sure the serializer recognizes and stores the submitted password, but doesn’t include it in the returned JSON. So we add the ‘password’ field to fields, but above that also specify that the password should be write only. Then, we override the serializer’s create() method, which determines how the object being serialized gets saved to the database. We do this primarily so that we can call the set_password() method on the user instance, which is how the password gets properly hashed.
        """
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password')
