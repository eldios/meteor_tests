Handlebars.registerHelper('pluralize',function(n,word){
  // fairly stupid pluralizer
  if (n === 1) {
    return '1 ' + word;
  } else {
    return n + ' ' + word + 's';
  }
});