PLC = RouteController.extend({
  template: 'postsList',
  increment: 5 ,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment ;
  },
  findOptions: function() {
    return {
      limit: this.postsLimit(),
    };
  },
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions());
  },
  data: function() {
    return {
      posts: Posts.find({}, this.findOptions()),
    };
  },
});

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
      Session.set('currentPost', this.params._id);
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
    controller: PLC,
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