Meteor.publish('posts', function(postsLimit){
  return Posts.find({}, {limit: postsLimit});
});

Meteor.publish('comments', function(postId){
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId});
});