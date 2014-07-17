/* 
* Handles user mouse input events
* There will eventually be a lot of them
*/

var mouseEvents = function () {

	// When first landing on the site. Affects pointer lock escape key too.
	document.addEventListener( 'click', function () {
		
		// Perhaps put this in display.js
		if ( userStates.arrival ) {

			pointerLock.lockPointer();

			// Remove and hide necessary elements
			displayBlocks.hideIntro();

			// Don't do this again till they next land
			userStates.arrival = false;

		}

	} );

	// Button to enter pointer lock
	document.addEventListener( 'click', function () {

	} );

}
