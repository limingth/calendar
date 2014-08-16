/*Router.configure({
  '/':'homepage',
  '/calendar': 'calendar'
})*/
Router.map(function(){
  this.route('homepage', {path:'/'});
  this.route('calendar', {path:'/calendar'});
})
