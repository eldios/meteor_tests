Template.header.helpers({
  activeRouteClass: function(/* route names */){
    var args = Array.prototype.slice.call(arguments,0);
    console.log('before pop '+args);
    args.pop ;
    console.log('after pop '+args);

    var active = _.any(args, function(name){
      return Router.current().route.name === name;
    });

    return active && 'active' ;
  },
});
