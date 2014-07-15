
/* 
* Handles user mouse input events
* There will eventually be a lot of them
*/
mouseEvents = function () {

	document.addEventListener('click', function () {
		
		// If the user has just opened the page
		if (userStates.arrival) {

			pointerLock.lockPointer();

			// Hide the intro
			// Show inspector stuff

			// userStates.arrival = false;

		}

	});


}
