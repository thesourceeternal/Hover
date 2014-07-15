
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
			document.getElementsByClassName("intro")[0].style.display = 'none';
			// Show inspector stuff

			userStates.arrival = false;

		}

	});


}
