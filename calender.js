// $(function(){
// 	// grabEvents();
// 	inputTimes(events_map);
// 	findPosition(events_map);
// 	console.log(events_map)
// 	renderEvents(events_map);
// });


/* Variables */

/* A schedule of the day. Each key represents a minute of the day and each value is an array of events that are booked for that minute */
day = new Map();

for(var i=0; i<=780; i++){
	day[i] = [];
}

events_map = new Map();

/* hardcoded event data for testing purposes */
events_map = {
    event1: {start: 30, end: 120},  
    event2: {start: 100, end: 140},
    event3: {start: 130, end: 360},
    event4: {start: 300, end: 400},
    event5: {start: 450, end: 600},
    event6: {start: 700, end: 720}
}

/* PART ONE: function that returns the top and left CSS positions for each event. I also added in the attributes width and overlappingEvents. */
function findPosition(events){
	var previousKey;
	for(var key in events){
		//position from the top of the calendar div is based on the start time. one minute equals one pixel.
		events[key]['top'] = events[key]['start'];

		//adding div width to the event's properties
		eventsOverlapping = booked(key, events[key]['start'], events[key]['end']);
		numEventsOverlapping = eventsOverlapping[0];
		positionInOverlap = eventsOverlapping[1];
		events[key]['width'] = 600/numEventsOverlapping; 

		//position from the left is dependent on how many events overlap at that time
		events[key]['left'] = events[key]['width'] * positionInOverlap;
		// console.log(key, "'s left value is", events[key]['left']);

		//we will need to update prior events for cascading events
		if(previousKey){
			checkForCascading(previousKey, key);
		}

		previousKey = key;
	}
}

/* PART TWO - get request from API endpoint */
function grabEvents(){
	$.get("https://appcues-interviews.firebaseio.com/calendar/events.json", function(res){
		for(var key in res){
			events_map[key] = res[key];
		}
	}).done(function(){
		inputTimes(events_map);
		findPosition(events_map);
		renderEvents(events_map);
	});
}

/*PART THREE - render events */
function renderEvents(events){
	for(var key in events){ 

		//grab the style elements of each event
		margin_top = events[key]['start'];
		margin_left = events[key]['left'];
		// console.log(key, "'s margin-left value:", margin_left);
		height = events[key]['end'] - events[key]['start'];
		width = events[key]['width'];
	
		//append the new div on the calendar
		div = "<div class='event border " + key + "'><span class=event-title>" + key + "</span></div>";
		selector = "div." + key;
		
		$('div.calendar-box').append(div);
		$(selector).css({'margin-top': margin_top, 'margin-left':margin_left, height: height, width: width});
	}
	
}


/* helper methods */

//takes in event and returns an array. arr[0] is the number of overlapping events. arr[1] is the position in which the event takes place in relation to the other overlapping events
function booked(key, start, end){
	val = [0];
	for(i=start; i<=end; i++){
		if(day[i].length > val[0]){
			val[0] = day[i].length;
			val[1] = day[i].indexOf(key);
			events_map[key]['overlappingEvents'] = day[i];
		}
	}

	return val;
}

//marks the events in our day scheduler
function inputTimes(events){
	for(var key in events){
		var start = events[key]['start'];
		var end = events[key]['end'];
		markTime(key, start, end);
	}
}

function markTime(key, start, end){
	for(i=start; i<=end; i++){
		day[i].push(key);
	}
}

//recursive that keeps cascading up to the beginning of a chain of cascading events
function checkForCascading(previousKey, key){
	// var previousKey;
	// var currentKey;

	var reverseKeys = [];

	for(var key in events_map){
		reverseKeys.unshift(key);
	}

	console.log(reverseKeys);
	
	var startingIndex = reverseKeys.indexOf(key);
	console.log('current key:', key);
	console.log('starting index:', startingIndex);
	
	// for(var i=startingIndex; i< reverseKeys.length; i++){
	// 	if((numEventsOverlapping > 1) && events_map[previousKey] && events_map[previousKey]['left'] != 0){
	// 		// console.log(key);
	// 		overlappingEvents = events_map[previousKey]['overlappingEvents'];

	// 		newWidth = 600/(overlappingEvents.length + 1);
	// 		for(i=0; i<overlappingEvents.length; i++){
	// 			currentKey = overlappingEvents[i];
	// 			events_map[currentKey]['width'] = newWidth;
	// 			events_map[currentKey]['left'] = newWidth * i;
	// 		}
	// 		events_map[key]['width'] = newWidth;
	// 		events_map[key]['left'] = newWidth * (overlappingEvents.length);

	// 		if((i+1) <= reverseKeys.length){
	// 			checkForCascading(reverseKeys[i+1], reverseKeys[i]);
	// 		}
	// 	}
	// }
	return 'complete';

}


inputTimes(events_map);
findPosition(events_map);
// console.log(events_map)
renderEvents(events_map);

// console.log(events_map);
// reverseKeys = [];

// for(var key in events_map){
// 	reverseKeys.unshift(key);
// }

// console.log(reverseKeys);



