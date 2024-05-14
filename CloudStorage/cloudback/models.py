import os
import uuid

from django.conf import settings
from django.contrib.auth.models import User,  AbstractUser
from django.db import models


def get_upload_to(instance, filename):
    return f'{instance.user.id}/' + f'{filename}'
# Create your models here.



# class CostumUser(AbstractUser):
#     avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)


class Files(models.Model):
    name = models.CharField(max_length=256)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to=get_upload_to)
    size = models.BigIntegerField( blank=True, null=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    download_at = models.DateTimeField(blank=True, null=True)
    download_counter = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    linkUiid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def save(self, *args, **kwargs):
        super(Files, self).save( *args, **kwargs)
        self.size = self.file.size
        super(Files, self).save(update_fields=['size'])

    # def __str__(self):
    #     return self.name +' | ' + self.size


