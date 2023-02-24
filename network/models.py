from django.contrib.auth.models import AbstractUser
from django.db import models
from emoji import get_emoji_unicode_dict

class User(AbstractUser):
    friends = models.ManyToManyField("self")
    profilePicture = models.ImageField(default='static/img/default.jpg',upload_to=None, blank=True)

    def __str__(self):
        return f"@{self.username}"

    def serialize(self):
        friends_list = list(self.friends.all().values_list())
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "friends": friends_list
        }

class Status(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="statuses")
    body = models.CharField(max_length=560)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user}'s Status: {self.body}"

    def serialize(self):
        return {
            "id": self.id,
            "username": self.user.username,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

class Comment(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="comments_made")
    commentPost = models.ForeignKey("Status", on_delete=models.CASCADE, related_name="comments")
    body = models.CharField(max_length=560)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user}: {self.body}"
        
    def serialize(self):
        return {
            "id": self.id,
            "commentPost": self.commentPost,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

class Reaction(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="reactions_sent")
    reactPost = models.ForeignKey("Status", on_delete=models.CASCADE, related_name="reactions")
    reaction = models.CharField(max_length=2)

    def __str__(self):
        return self.reaction

    def is_emoji(self):
        count = 0
        for emoji in get_emoji_unicode_dict:
            count += self.count(emoji)
            if count > 1:
                return False
        return bool(count)

    def serialize(self):
        return {
            "id": self.id,
            "reactPost": self.reactPost,
            "reaction": self.reaction
        }