// $(function(){
// 	renderEvents(findPosition(grabEvents()));
// });


/* Variables */

/* Map that represents minute by minute schedule of the day. Each key represents a minute of that day and each value represents how many events are booked for that minute. */
day = new Map();

for(var i=0; i<=720; i++){
	day[i] = 0;
}

/* hardcoded event data for testing purposes */
events = {
	// an event from 10am to 11am
    event1: {start: 60, end: 120},  
    // an event from 10:40am to 1pm 
    event2: {start: 100, end: 240},
    // an event from 12:40pm to 3pm
    event3: {start: 220, end: 360},
    // an event from 8:40pm to 9pm 
    event4: {start: 700, end: 720}  
}

/* PART ONE: function that returns the top and left CSS positions for each event */
function findPosition(events){
	var previousKey;
	for(var key in events){
		//console.log(day);

		//position from the top of the calendar div is based on the start time. one minute equals one pixel.
		events[key]['top'] = events[key]['start'];

		//position from the left is dependent on how many events overlap at that time
		var eventsExisting = booked(events[key]['start'], events[key]['end']);
		console.log(key, "has", eventsExisting, "overlapping events");

		console.log("previousKey:", previousKey);
		if(eventsExisting){
			var previousLeft = events[previousKey]['left'];
			var width = 600/(eventsExisting + 1);
			console.log("width", width);
			if(previousLeft)
			{
				events[key]['left'] = previousLeft;
			}
			events[key]['left'] = width * eventsExisting;
		} else {
			events[key]['left'] = 0;
		}

		//mark the time in our scheduler first
		markTime(events[key]['start'], events[key]['end']);
		previousKey = key;
	}
}

/* PART TWO - get request from API endpoint */
function grabEvents(){
	$.get("https://appcues-interviews.firebaseio.com/calendar/events.json", function(res){
		return res;
	});
}

/*PART THREE - render events */
function renderEvents(events){
	//create the div with the css styling for each event
	for(var key in events){
		// var start = events[key]['start'];
		// var left = events[key]['left'];
		// var height = 
		css = {
			'margin-top': events[key]['start'],
			'margin-left': events[key]['left'],
			'height': events[key]['end'] - events[key]['start'],
			'width': 300
		}
		console.log(key);
		console.log(css);
	}
	

	//append the new div on the calendar
}


/* helper methods */

function booked(start, end){
	val = 0;
	for(i=start; i<=end; i++){
		if(day[i]){
			val = day[i];
		}
	}

	return val;
}

function markTime(start, end){
	for(i=start; i<=end; i++){
		day[i] += 1;
	}
}

// findPosition(events);
// console.log(events);
renderEvents(events);

