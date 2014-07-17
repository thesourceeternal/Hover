/* 
* Handles user mouse input events
* There will eventually be a lot of them
*/

var mouseEvents = function () {

	// --- Input Elements --- \\
	// Button to enter pointer lock
	document.addEventListener( 'click', function () {

	} );


	// --- Intro --- \\
	// When first landing on the site. Escape key works too.
	// This event listener will not be removed, it's too much work for
	// one little event listener
	document.addEventListener( 'click', function () {
		
		// Perhaps put this in display.js
		if ( userState.arrival ) {

			// lockPointer() will hide the
			// intro and turn userState.arrival to false
			pointerLock.lockPointer();

		}

	} );

};
