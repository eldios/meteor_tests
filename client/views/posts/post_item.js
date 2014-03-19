Template.postItem.helpers({
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url ;
    return a.hostname ;
  },
  ownPost: function() {
    return this.userId === Meteor.userId();
  },
  votes: function(){
    var post = Posts.findOne(this._id);
    var pluralize = function(n,word){
      // fairly stupid pluralizer
      if (n === 1) {
        return '1 ' + word;
      } else {
        return n + ' ' + word + 's';
      }
    } ;    
    if (post)
      return pluralize(post.votes, 'Vote');
    else
      throw new Meteor.Error(404, 'Post Not found');
  },
  upvotedClass:  function(){
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)){
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    };
  },
});
Template.postItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  },
});
