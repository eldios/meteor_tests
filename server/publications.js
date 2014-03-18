Meteor.publish('posts', function(opts){
  return Posts.find({}, opts);
});

Meteor.publish('singlePost', function(id){
  return id && Posts.findOne(id);
});

Meteor.publish('comments', function(postId){
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId});
});
