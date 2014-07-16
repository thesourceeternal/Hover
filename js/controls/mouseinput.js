/* 
* Handles user mouse input events
* There will eventually be a lot of them
*/

var mouseEvents = function () {

	document.addEventListener( 'click', function () {
		
		// Perhaps put this in display.js
		// If the user has just opened the page
		if ( userStates.arrival ) {

			pointerLock.lockPointer();

			// Hide the intro
			// Perhaps remove instead
			document.getElementsByClassName( "intro" )[0].style.display = 'none';
			// Show inspector stuff

			// Don't do this again till they next land
			userStates.arrival = false;

		}

	} );

}
