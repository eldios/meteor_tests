Template.postPage.helpers({
  comments: function(){
    return Comments.find({postId: this._id});
  },
  currentPost: function(){
    return Posts.findOne(this._id);
  },
});