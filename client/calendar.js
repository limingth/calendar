var CalEvents = new Meteor.Collection('calevents');

Session.setDefault('editing_calevent', null);
Session.setDefault('showEditEvent', false);
Session.setDefault('lastMod', null);

//Template functions
Template.calendar.rendered = function(){
	$('#calendar').fullCalendar({
		dayClick:function( date, allDay, jsEvent, view ) {
			CalEvents.insert({title:'New Event',start:date,end:date});
			Session.set('lastMod',new Date());
			$('#edit-event-modal').show();
		},
		eventClick:function(calEvent,jsEvent,view){
			Session.set('editing_calevent',calEvent._id);
			Session.set('showEditEvent',true);
		},
		eventDrop:function(calEvent){
			CalEvents.update(calEvent.id, {$set: {start:calEvent.start,end:calEvent.end}});
			Session.set('lastMod',new Date());
		},
		events: function(start, end, callback) {
	     	var events = [];
			calEvents = CalEvents.find();
			calEvents.forEach(function(evt){
				events.push({id:evt._id,title:evt.title,start:evt.start,end:evt.end});
			})
			callback(events);
		},
		editable:true
	});
}
Template.calendar.showEditEvent = function(){
	return Session.get('showEditEvent');
}
Template.calendar.lastMod = function(){
	return Session.get('lastMod');
}

Template.editEvent.evt = function(){
	var calEvent = CalEvents.findOne({_id:Session.get('editing_calevent')});
	return calEvent;
}
Template.editEvent.events({
	'click #save': function(evt, tmpl){
		updateCalEvent(Session.get('editing_calevent'), tmpl.find('#title').value);
		Session.set('editing_calevent', null);
		Session.set('showEditEvent', false);
	},
	'click #cancel': function(evt, tmpl){
		Session.set('editing_calevent', null);
		Session.set('showEditEvent', false);
	},
	'click #delete': function(evt, tmpl){
		deleteCalEvent(Session.get('editing_calevent'));
		Session.set('editing_calevent', null);
		Session.set('showEditEvent', false);
	}
})


//Data treatmend
var updateCalEvent = function(id, title){
	CalEvents.update(id, {$set: {title:title}});
	return true;
}
var deleteCalEvent = function(id, title){
	CalEvents.remove(id);
	return true;
}


Meteor.startup(function() {
	Deps.autorun(function() {
		// bound the collection with the calendar so it updates reactively
		var entries = CalEvents.find().fetch(),
		    $calendar = $('#calendar');
		$calendar.fullCalendar('removeEvents');
		$calendar.fullCalendar('addEventSource', entries);
		$calendar.fullCalendar('rerenderEvents');
	});
});

