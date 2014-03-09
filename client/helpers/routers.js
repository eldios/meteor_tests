Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    return [ 
      Meteor.subscribe('notifications'), 
    ] ; 
  },
});

Router.map(function(){
  this.route('postPage', {
    path: '/posts/:_id',
    waitOn: function() {
      return Meteor.subscribe('comments', this.params._id);
    },
    data: function() {
      Session.set('currentPostId', this.params._id);
      return Posts.findOne(this.params._id);
    },
  });    

  this.route('postEdit',{
    path: '/posts/:_id/edit',
    data: function(){
      Session.set('currentPostId', this.params._id);
      return Posts.findOne(this.params._id);
    }, 
  });

  this.route('postSubmit', {
    path: '/submit'
  });

  this.route('postsList', {
    path: '/:postsLimit?',
    waitOn: function() {
      var postsLimit = parseInt(this.params.postsLimit) || 5 ;
      return Meteor.subscribe('posts', postsLimit);
    },
    data: function() {
      var limit = parseInt(this.params.postsLimit) || 5 ;
      return {
        posts: Posts.find({}, {sort: {submitted: -1}, limit: limit})
      };
    },
  });

  var requireLogin = function(){
    if (! Meteor.user()){
      if (Meteor.loggingIn())
        this.render(this.loadingTemplate);
      else
        this.render('accessDenied');

      this.stop();
    };
  };

  Router.before(requireLogin, {only: 'postSubmit'});
  Router.before(function() { cleanErrors() });

});