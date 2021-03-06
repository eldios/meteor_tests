Posts = new Meteor.Collection('posts');

Posts.deny({
  update: function(userId, post, fieldNames) {
    return (_.without(fieldNames, 'url', 'title').length > 0);
  },
});

Posts.allow({
  update: ownsDocument,
  remove: ownsDocument,
});

Meteor.methods({
  post: function(postAttributes) {
    var user = Meteor.user(),
    postWithSameLink = Posts.findOne({url: postAttributes.url});
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to post new stories");
    // ensure the post has a title
    if (!postAttributes.title)
      throw new Meteor.Error(422, 'Please fill in a headline');
    // check that there are no previous posts with the same link
    if (postAttributes.url && postWithSameLink) {
      throw new Meteor.Error(302,
        'A post with the same URL has already been created',
        postWithSameLink._id);
    }

    // pick out the whitelisted keys
    var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message'), {
      title: postAttributes.title + (this.isSimulation ? ' *client*' : ' *server*'),
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime(),
      commentsCount: 0,
      upvoters: [], votes:0 ,
    });

    var postId = Posts.insert(post);
    return postId ;
  },

  upvote: function (postId) {
    var user = Meteor.user();
    if (!user)
      throw new Meteor.Error(401, "You need to login to upvote");

    Posts.update({
      _id: postId,
      upvoters: {$ne: user._id}
    } , {
      $addToSet: {upvoters: user._id},
      $inc: {votes: 1},
    });
  },
});
