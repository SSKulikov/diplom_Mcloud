from datetime import datetime
import logging
from rest_framework import serializers
from rest_framework.authtoken.admin import User
from rest_framework.authtoken.models import Token

from .models import Files

logger = logging.getLogger("django")

class FilesSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    class Meta:
        model = Files
        fields = ['id','name', 'description','file', 'size', 'created_at', 'user', 'linkUiid', 'download_counter', "download_at"]
        read_only_fields = ['created_at', 'size', 'linkUiid']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['file'].name = validated_data['name'] + '.' + validated_data['file'].name.split('.')[-1]
        return Files.objects.create(**validated_data)
    # def save(self, **kwargs):
    #     kwargs["user"] = self.fields["user"].get_default()
    #     return super().save(**kwargs)


class UserSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(write_only=True)
    files = FilesSerializer(many=True, read_only=True)

    def create(self, validated_data):
        logger.info('Create new User')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],

        )

        return user
    class Meta:
        model = User
        fields = ['id', 'username','password', 'is_staff','email', 'files', "first_name", "last_name", "date_joined"]
        read_only_fields = ['files']


    def save(self, **kwargs):
        user = super(UserSerializer, self).save(**kwargs)
        if not Token.objects.filter(user=user):
            Token.objects.create(user=user)

    def update(self, instance, validated_data):
        # instance.name = validated_data.get('name', instance.name)
        # validated_data.update(instance)

        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.email = validated_data.get('email', instance.email)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        if validated_data.get('password') is not None:
            instance.set_password(validated_data.get('password'))
        instance.save()

        return instance
