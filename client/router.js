/*Router.configure({
  '/':'homepage',
  '/calendar': 'calendar'
})*/


Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function(){
  this.route('homepage', {path:'/'});
  this.route('calendar', {path:'/calendar'});
})
